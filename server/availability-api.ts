import { createAvailabilityService, readAvailabilityConfig, AvailabilityError } from './availability-service';

let service: ReturnType<typeof createAvailabilityService> | undefined;
const requests = new Map<string, { count: number; reset: number }>();

export async function availabilityResponse(url: URL, clientKey = 'local'): Promise<Response> {
  const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };
  const now = Date.now();
  const bucket = requests.get(clientKey);
  if (bucket && bucket.reset > now && bucket.count >= 90) return Response.json({ status: 'unavailable', message: 'Please wait a moment and try again.' }, { status: 429, headers: { ...headers, 'Retry-After': '60' } });
  if (!bucket || bucket.reset <= now) {
    if (requests.size >= 1024) requests.delete(requests.keys().next().value!);
    requests.set(clientKey, { count: 1, reset: now + 60000 });
  } else bucket.count++;
  try {
    const from = url.searchParams.get('from') || '';
    const to = url.searchParams.get('to') || '';
    service ??= createAvailabilityService(readAvailabilityConfig(process.env));
    const data = await service.get(from, to, url.searchParams.get('fresh') === '1');
    return Response.json(data, { headers });
  } catch (error) {
    const invalid = error instanceof AvailabilityError && error.code === 'INVALID_RANGE';
    const limited = error instanceof AvailabilityError && error.code === 'RATE_LIMITED';
    return Response.json({ status: 'unavailable', message: invalid ? 'Please choose a valid date range of up to one year.' : 'We can’t check dates right now. Please try again or contact your host.' }, {
      status: invalid ? 400 : limited ? 429 : 503, headers: { ...headers, ...(invalid ? {} : { 'Retry-After': '60' }) },
    });
  }
}
