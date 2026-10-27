import { JWT } from 'google-auth-library';
import { demoAvailability, normalizeEvents, validDate, zonedMidnight, nightsBetween, type AvailabilityData, type CalendarEvent } from '../src/lib/availability-rules';

type CalendarPage = { items?: CalendarEvent[]; nextPageToken?: string };
export type AvailabilityConfig = {
  mode: 'demo' | 'google'; calendarId?: string; email?: string; privateKey?: string;
  timeZone: string; cacheSeconds: number; refreshSeconds: number; timeoutMs: number; minimumNights: number;
};
export class AvailabilityError extends Error {
  constructor(public readonly code: 'INVALID_RANGE' | 'NOT_CONFIGURED' | 'UPSTREAM_UNAVAILABLE' | 'RATE_LIMITED') { super(code); }
}

function numberInRange(value: string | undefined, fallback: number, min: number, max: number) {
  const parsed = value?.trim() ? Number(value) : fallback;
  if (!Number.isInteger(parsed) || parsed < min || parsed > max) throw new AvailabilityError('NOT_CONFIGURED');
  return parsed;
}

export function readAvailabilityConfig(env: Record<string, string | undefined>): AvailabilityConfig {
  const mode = env.AVAILABILITY_MODE || 'demo';
  if (!['demo', 'google'].includes(mode)) throw new AvailabilityError('NOT_CONFIGURED');
  const timeZone = env.PROPERTY_TIMEZONE || 'Asia/Kolkata';
  try { new Intl.DateTimeFormat('en', { timeZone }).format(); } catch { throw new AvailabilityError('NOT_CONFIGURED'); }
  return {
    mode: mode as AvailabilityConfig['mode'], calendarId: env.GOOGLE_CALENDAR_ID, email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    privateKey: env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'), timeZone,
    cacheSeconds: numberInRange(env.AVAILABILITY_CACHE_SECONDS, 60, 5, 300),
    refreshSeconds: numberInRange(env.AVAILABILITY_REFRESH_SECONDS, 60, 15, 300),
    timeoutMs: numberInRange(env.GOOGLE_CALENDAR_TIMEOUT_MS, 8000, 1000, 30000),
    minimumNights: numberInRange(env.MIN_STAY_NIGHTS, 0, 0, 365),
  };
}

export function createAvailabilityService(config: AvailabilityConfig, dependencies: { now?: () => number; requestPage?: (params: Record<string, string>) => Promise<CalendarPage> } = {}) {
  const now = dependencies.now || Date.now;
  const cache = new Map<string, { expires: number; data: AvailabilityData }>();
  const pending = new Map<string, Promise<AvailabilityData>>();
  const generations = new Map<string, number>();
  const auth = config.email && config.privateKey ? new JWT({ email: config.email, key: config.privateKey, scopes: ['https://www.googleapis.com/auth/calendar.events.readonly'] }) : null;
  const requestPage = dependencies.requestPage || (async (params: Record<string, string>) => {
    if (!auth || !config.calendarId) throw new AvailabilityError('NOT_CONFIGURED');
    const response = await auth.request<CalendarPage>({
      url: `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(config.calendarId)}/events`,
      method: 'GET', params, timeout: config.timeoutMs, retry: false,
    });
    return response.data;
  });

  async function load(from: string, to: string): Promise<AvailabilityData> {
    if (config.mode === 'demo') return demoAvailability(from, to, new Date(now()));
    if (!dependencies.requestPage && (!config.calendarId || !auth)) throw new AvailabilityError('NOT_CONFIGURED');
    try {
      const events: CalendarEvent[] = [];
      const deadline = Date.now() + config.timeoutMs;
      let pageToken: string | undefined;
      let pages = 0;
      do {
        let timer: ReturnType<typeof setTimeout> | undefined;
        const result = await Promise.race([requestPage({
          timeMin: zonedMidnight(from, config.timeZone), timeMax: zonedMidnight(to, config.timeZone), timeZone: config.timeZone,
          singleEvents: 'true', showDeleted: 'false', maxResults: '2500', orderBy: 'startTime',
          fields: 'items(status,start,end),nextPageToken', ...(pageToken ? { pageToken } : {}),
        }), new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error('Calendar timeout')), Math.max(1, deadline - Date.now())); })]).finally(() => clearTimeout(timer));
        if (!result || !Array.isArray(result.items ?? [])) throw new Error('Invalid response');
        events.push(...(result.items || [])); pageToken = result.nextPageToken; pages++;
        if (pages >= 8 && pageToken) throw new Error('Calendar result exceeds safe bound');
      } while (pageToken);
      return {
        status: 'ok', unavailable: normalizeEvents(events, config.timeZone, from, to), range: { from, to },
        timeZone: config.timeZone, minStayNights: config.minimumNights, refreshedAt: new Date(now()).toISOString(), refreshAfterSeconds: config.refreshSeconds,
      };
    } catch (error) {
      if (error instanceof AvailabilityError) throw error;
      const status = (error as { response?: { status?: number } }).response?.status;
      throw new AvailabilityError(status === 429 ? 'RATE_LIMITED' : 'UPSTREAM_UNAVAILABLE');
    }
  }

  return {
    async get(from: string, to: string, fresh = false): Promise<AvailabilityData> {
      if (!validDate(from) || !validDate(to) || to <= from || nightsBetween(from, to) > 366) throw new AvailabilityError('INVALID_RANGE');
      const key = `${from}/${to}`;
      const existing = cache.get(key);
      if (!fresh && existing && existing.expires > now()) return existing.data;
      const requestKey = `${fresh ? 'fresh' : 'cached'}/${key}`;
      const inFlight = pending.get(requestKey);
      if (inFlight) return inFlight;
      if (pending.size >= 64) throw new AvailabilityError('RATE_LIMITED');
      const generation = (generations.get(key) || 0) + 1;
      generations.set(key, generation);
      const promise = load(from, to).then(data => {
        if (generations.get(key) === generation) {
          if (cache.size >= 64) { const oldest = cache.keys().next().value!; cache.delete(oldest); generations.delete(oldest); }
          cache.set(key, { data, expires: now() + config.cacheSeconds * 1000 });
        }
        return data;
      }).catch(error => { if (generations.get(key) === generation) cache.delete(key); throw error; }).finally(() => { pending.delete(requestKey); if (!cache.has(key) && !pending.has(`cached/${key}`) && !pending.has(`fresh/${key}`)) generations.delete(key); });
      pending.set(requestKey, promise);
      return promise;
    },
  };
}
