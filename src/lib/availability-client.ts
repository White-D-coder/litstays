import { demoAvailability, validDate, type AvailabilityData } from './availability-rules';

export const availabilityMode = process.env.NEXT_PUBLIC_AVAILABILITY_MODE || 'demo';

export async function fetchAvailability(from: string, to: string, options: { fresh?: boolean; signal?: AbortSignal } = {}): Promise<AvailabilityData> {
  if (!validDate(from) || !validDate(to) || to <= from) throw new Error('Please choose a valid date range.');
  if (availabilityMode === 'demo') {
    await new Promise(resolve => setTimeout(resolve, 150));
    if (options.signal?.aborted) throw new DOMException('Aborted', 'AbortError');
    return demoAvailability(from, to);
  }
  return fetchLiveAvailability(from, to, options);
}

export async function fetchLiveAvailability(from: string, to: string, options: { fresh?: boolean; signal?: AbortSignal } = {}): Promise<AvailabilityData> {
  if (!validDate(from) || !validDate(to) || to <= from) throw new Error('Please choose a valid date range.');
  const controller = new AbortController();
  const abort = () => controller.abort();
  options.signal?.addEventListener('abort', abort, { once: true });
  if (options.signal?.aborted) controller.abort();
  const timeout = setTimeout(abort, 12000);
  try {
    const origin = (process.env.NEXT_PUBLIC_AVAILABILITY_API_URL || '').replace(/\/$/, '');
    const params = new URLSearchParams({ from, to, ...(options.fresh ? { fresh: '1' } : {}) });
    const response = await fetch(`${origin}/api/availability?${params}`, { signal: controller.signal, cache: 'no-store', credentials: 'omit' });
    if (!response.ok) throw new Error('Availability is temporarily unavailable. Please try again.');
    const data = await response.json() as AvailabilityData;
    if (data.status !== 'ok' || !Array.isArray(data.unavailable) || data.unavailable.some(range => !validDate(range.start) || !validDate(range.end) || range.end <= range.start) || data.range?.from !== from || data.range?.to !== to || !Number.isInteger(data.minStayNights) || data.minStayNights < 0 || !Number.isFinite(data.refreshAfterSeconds) || !Number.isFinite(Date.parse(data.refreshedAt))) throw new Error('Availability could not be verified. Please try again.');
    return data;
  } finally {
    clearTimeout(timeout);
    options.signal?.removeEventListener('abort', abort);
  }
}
