import test from 'node:test';
import assert from 'node:assert/strict';
import { addDays, isUnavailable, normalizeEvents, stayError, validDate, zonedMidnight, type CalendarEvent } from '../src/lib/availability-rules';
import { createAvailabilityService, readAvailabilityConfig, AvailabilityError, type AvailabilityConfig } from '../server/availability-service';
import { availabilityResponse } from '../server/availability-api';
import { fetchLiveAvailability } from '../src/lib/availability-client';

const config: AvailabilityConfig = { mode: 'google', calendarId: 'private-calendar', timeZone: 'Asia/Kolkata', cacheSeconds: 60, refreshSeconds: 60, timeoutMs: 8000, minimumNights: 0 };
const block = (start: string, end: string): CalendarEvent => ({ status: 'confirmed', start: { date: start }, end: { date: end } });
const normalize = (events: CalendarEvent[]) => normalizeEvents(events, 'Asia/Kolkata', '2026-11-01', '2027-01-01');

test('calendar dates are validated rather than normalized into a different month', () => {
  assert.equal(validDate('2026-02-30'), false);
  assert.equal(validDate('2028-02-29'), true);
  assert.equal(addDays('2026-11-30', 1), '2026-12-01');
});

test('ordinary booking occupies nights 12, 13 and 14; checkout boundary 15 is free', () => {
  const ranges = normalize([block('2026-11-12', '2026-11-15')]);
  for (const date of ['2026-11-12', '2026-11-13', '2026-11-14']) assert.equal(isUnavailable(date, ranges), true);
  assert.equal(isUnavailable('2026-11-15', ranges), false);
  assert.equal(stayError('2026-11-15', '2026-11-17', ranges), null);
  assert.equal(stayError('2026-11-10', '2026-11-12', ranges), null);
  assert.match(stayError('2026-11-11', '2026-11-16', ranges)!, /unavailable/);
});

test('consecutive reservations merge without freeing the next reservation’s check-in night', () => {
  const ranges = normalize([block('2026-11-12', '2026-11-15'), block('2026-11-15', '2026-11-18')]);
  assert.deepEqual(ranges, [{ start: '2026-11-12', end: '2026-11-18' }]);
  assert.match(stayError('2026-11-15', '2026-11-16', ranges)!, /unavailable/);
  assert.equal(stayError('2026-11-18', '2026-11-19', ranges), null);
});

test('owner blocks and maintenance are unavailable regardless of title or transparency', () => {
  const events = [{ ...block('2026-11-02', '2026-11-04'), summary: 'OWNER BLOCK', transparency: 'transparent' }, { ...block('2026-11-07', '2026-11-08'), summary: 'MAINTENANCE' }];
  const ranges = normalize(events);
  assert.equal(isUnavailable('2026-11-03', ranges), true);
  assert.equal(isUnavailable('2026-11-07', ranges), true);
});

test('month-spanning events retain their exclusive checkout date', () => {
  const ranges = normalize([block('2026-11-30', '2026-12-03')]);
  assert.equal(isUnavailable('2026-12-02', ranges), true);
  assert.equal(isUnavailable('2026-12-03', ranges), false);
});

test('timed events use the property timezone and a midnight end is exclusive', () => {
  const event = { start: { dateTime: '2026-11-11T18:30:00Z' }, end: { dateTime: '2026-11-14T18:30:00Z' } };
  assert.deepEqual(normalize([event]), [{ start: '2026-11-12', end: '2026-11-15' }]);
  assert.deepEqual(normalize([{ start: { dateTime: '2026-11-11T20:00:00Z' }, end: { dateTime: '2026-11-12T20:00:00Z' } }]), [{ start: '2026-11-12', end: '2026-11-14' }]);
});

test('DST changes query boundaries without changing calendar-night arithmetic', () => {
  const start = zonedMidnight('2026-03-08', 'America/New_York');
  const end = zonedMidnight('2026-03-09', 'America/New_York');
  assert.equal(start, '2026-03-08T05:00:00.000Z');
  assert.equal(end, '2026-03-09T04:00:00.000Z');
  assert.equal((Date.parse(end) - Date.parse(start)) / 3600000, 23);
  assert.equal(zonedMidnight('2026-11-12', 'Asia/Kolkata'), '2026-11-11T18:30:00.000Z');
});

test('cancelled events are removed; no minimum stay is invented', () => {
  assert.deepEqual(normalize([{ ...block('2026-11-12', '2026-11-15'), status: 'cancelled' }]), []);
  assert.equal(stayError('2026-11-12', '2026-11-13', []), null);
  assert.match(stayError('2026-11-12', '2026-11-13', [], 3)!, /at least 3 nights/);
  assert.match(stayError('2026-11-12', '2026-11-12', [])!, /after check-in/);
});

test('empty calendars are available only after a successful upstream response', async () => {
  const service = createAvailabilityService(config, { requestPage: async () => ({ items: [] }) });
  const result = await service.get('2026-11-01', '2026-12-01');
  assert.equal(result.status, 'ok'); assert.deepEqual(result.unavailable, []);
});

test('recurrences are expanded, pages are collected, and private fields are never requested or returned', async () => {
  const calls: Record<string, string>[] = [];
  const service = createAvailabilityService(config, { requestPage: async params => {
    calls.push(params);
    return params.pageToken ? { items: [block('2026-11-19', '2026-11-20')] } : { items: [block('2026-11-12', '2026-11-13')], nextPageToken: 'page-two' };
  } });
  const result = await service.get('2026-11-01', '2026-12-01');
  assert.equal(calls.length, 2); assert.equal(calls[0].singleEvents, 'true'); assert.equal(calls[0].showDeleted, 'false');
  assert.equal(calls[0].fields, 'items(status,start,end),nextPageToken');
  assert.equal(calls[0].timeMin, '2026-10-31T18:30:00.000Z');
  assert.equal(result.unavailable.length, 2); assert.equal(JSON.stringify(result).includes('private-calendar'), false);
});

test('short cache expires, and an enquiry refresh bypasses even a fresh cache', async () => {
  let now = 1000; let calls = 0;
  const service = createAvailabilityService(config, { now: () => now, requestPage: async () => { calls++; return { items: [] }; } });
  await service.get('2026-11-01', '2026-12-01'); await service.get('2026-11-01', '2026-12-01');
  assert.equal(calls, 1);
  await service.get('2026-11-01', '2026-12-01', true); assert.equal(calls, 2);
  now += 61000;
  await service.get('2026-11-01', '2026-12-01'); assert.equal(calls, 3);
});

test('a failed refresh never serves stale availability; recovery performs a new request', async () => {
  let now = 1000; let failed = false; let calls = 0;
  const service = createAvailabilityService(config, { now: () => now, requestPage: async () => { calls++; if (failed) throw new Error('sensitive upstream error'); return { items: [] }; } });
  await service.get('2026-11-01', '2026-12-01'); now += 61000; failed = true;
  await assert.rejects(service.get('2026-11-01', '2026-12-01'), (error: AvailabilityError) => error.code === 'UPSTREAM_UNAVAILABLE' && !error.message.includes('sensitive'));
  failed = false; await service.get('2026-11-01', '2026-12-01'); assert.equal(calls, 3);
});

test('authentication errors, rate limits and timeouts produce closed, sanitized failures', async () => {
  for (const status of [401, 403, 429, 500]) {
    const service = createAvailabilityService(config, { requestPage: async () => { throw { response: { status }, message: 'PRIVATE KEY must not leak' }; } });
    await assert.rejects(service.get('2026-11-01', '2026-12-01'), (error: AvailabilityError) => error.code === (status === 429 ? 'RATE_LIMITED' : 'UPSTREAM_UNAVAILABLE') && !error.message.includes('PRIVATE'));
  }
  const timedOut = createAvailabilityService(config, { requestPage: async () => { throw new DOMException('Timed out', 'TimeoutError'); } });
  await assert.rejects(timedOut.get('2026-11-01', '2026-12-01'), AvailabilityError);
});

test('live mode without credentials fails rather than returning an empty or dummy calendar', async () => {
  const service = createAvailabilityService(config);
  await assert.rejects(service.get('2026-11-01', '2026-12-01'), (error: AvailabilityError) => error.code === 'NOT_CONFIGURED');
  assert.throws(() => readAvailabilityConfig({ NODE_ENV: 'test', PROPERTY_TIMEZONE: 'not-a-timezone' }), AvailabilityError);
});

test('public endpoint validates bounds and clearly identifies demo dates', async () => {
  const invalid = await availabilityResponse(new URL('http://localhost/api/availability?from=2026-02-30&to=2026-04-01'));
  assert.equal(invalid.status, 400);
  const demo = await availabilityResponse(new URL('http://localhost/api/availability?from=2026-11-01&to=2026-12-01'));
  const body = await demo.json(); assert.equal(body.status, 'demo');
  assert.equal(body.unavailable[0].start, '2026-11-12');
  assert.equal(demo.headers.get('cache-control'), 'no-store');
  assert.equal(JSON.stringify(body).includes('calendarId'), false);
});

test('a slower earlier request cannot overwrite a newer enquiry refresh', async () => {
  let resolveOlder!: (page: { items: CalendarEvent[] }) => void;
  let calls = 0;
  const service = createAvailabilityService(config, { requestPage: async () => {
    calls++;
    if (calls === 1) return new Promise(resolve => { resolveOlder = resolve; });
    return { items: [block('2026-11-12', '2026-11-15')] };
  } });
  const earlier = service.get('2026-11-01', '2026-12-01');
  const fresh = await service.get('2026-11-01', '2026-12-01', true);
  resolveOlder({ items: [] }); await earlier;
  const cached = await service.get('2026-11-01', '2026-12-01');
  assert.deepEqual(cached.unavailable, fresh.unavailable);
});

test('the complete upstream operation has a deadline even if authentication never resolves', async () => {
  const service = createAvailabilityService({ ...config, timeoutMs: 10 }, { requestPage: () => new Promise(() => {}) });
  await assert.rejects(service.get('2026-11-01', '2026-12-01'), (error: AvailabilityError) => error.code === 'UPSTREAM_UNAVAILABLE');
});

test('live browser requests reject upstream errors and demo responses instead of inventing availability', async () => {
  const originalFetch = globalThis.fetch;
  try {
    globalThis.fetch = async () => new Response('{}', { status: 503 });
    await assert.rejects(fetchLiveAvailability('2026-11-01', '2026-12-01'), /temporarily unavailable/);
    globalThis.fetch = async () => Response.json({ status: 'demo', unavailable: [] });
    await assert.rejects(fetchLiveAvailability('2026-11-01', '2026-12-01'), /could not be verified/);
    globalThis.fetch = async input => { assert.match(String(input), /fresh=1/); return Response.json({ status: 'ok', unavailable: [], range: { from: '2026-11-01', to: '2026-12-01' }, timeZone: 'Asia/Kolkata', minStayNights: 0, refreshAfterSeconds: 60, refreshedAt: new Date().toISOString() }); };
    assert.equal((await fetchLiveAvailability('2026-11-01', '2026-12-01', { fresh: true })).status, 'ok');
  } finally {
    globalThis.fetch = originalFetch;
  }
});
