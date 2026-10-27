# Private Google Calendar availability

The current site runs in explicit demo mode, as requested. Both the UI and the prepared enquiry identify the dates as sample data. Nothing in demo mode claims to represent real property bookings.

## Create the dedicated calendar

1. In Google Calendar, create a separate calendar for Villa Archway. Keep it private and set its timezone to **Asia/Kolkata**.
2. In a Google Cloud project, enable the Google Calendar API.
3. Create a dedicated service account. It does not need broad project-level IAM roles or domain-wide delegation.
4. Share only the bungalow calendar with the service account's email, with **See all event details** access. The service uses the `calendar.events.readonly` OAuth scope and never requests event names, descriptions, attendees, or contact information.
5. Create a service-account key and store its email and private key in the production server's secret/environment configuration. Do not put them in any `NEXT_PUBLIC_` variable, source file, or frontend host configuration.
6. Copy the calendar ID from Google Calendar settings. Store it only in `GOOGLE_CALENDAR_ID` on the server.

Google references: [service-account authentication](https://developers.google.com/identity/protocols/oauth2/service-account), [events.list range and recurrence semantics](https://developers.google.com/workspace/calendar/api/v3/reference/events/list).

## Environment configuration

Copy `.env.example` to `.env.local` for local development. The example contains placeholders only; real `.env` files are ignored by Git.

| Variable | Purpose |
| --- | --- |
| `AVAILABILITY_MODE` | Server mode: `demo` or `google` |
| `NEXT_PUBLIC_AVAILABILITY_MODE` | Frontend mode: `demo` or `google`; rebuild after changing |
| `GOOGLE_CALENDAR_ID` | Private dedicated calendar ID; server only |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Read-only service account email; server only |
| `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` | PKCS#8 PEM key; server only, literal newlines or escaped `\n` supported |
| `PROPERTY_TIMEZONE` | IANA timezone, default `Asia/Kolkata`; must match the dedicated calendar |
| `AVAILABILITY_CACHE_SECONDS` | Server cache lifetime: 5–300 seconds, default 60 |
| `AVAILABILITY_REFRESH_SECONDS` | Browser refresh interval: 15–300 seconds, default 60 |
| `GOOGLE_CALENDAR_TIMEOUT_MS` | Whole upstream operation deadline: 1000–30000 ms, default 8000 |
| `MIN_STAY_NIGHTS` | Optional owner-confirmed minimum; blank means no additional minimum |
| `NEXT_PUBLIC_AVAILABILITY_API_URL` | Optional separate API origin; blank uses same-origin `/api/availability` |
| `AVAILABILITY_ALLOWED_ORIGIN` | Comma-separated explicit frontend origins when using a separate API |
| `PORT` | Production HTTP port, default 3000 |
| `LITSTAYS_HOST` | Bind address; use `0.0.0.0` on a production Node host |

For live use, set **both** modes to `google`, configure the private server variables, rebuild, and restart. Missing credentials, malformed responses, or a demo response returned to a live client cause a recoverable error; they never fall back to an empty "available" calendar.

```sh
npm ci
npm run dev
```

For a Node production host:

```sh
npm run build
LITSTAYS_HOST=0.0.0.0 npm start
```

Keep secrets in the Node host's secret manager. `npm start` serves both the static frontend and the API. The separate development API is started automatically by `npm run dev`.

The current Sites publication is a static demo. To keep using a static frontend host with a live calendar, deploy the included Node API separately, configure its allowed frontend origin, set the frontend's public API origin and `google` mode, and rebuild. Never move server credentials into the static host's public build environment.

## Owner workflow and occupied nights

Create an all-day event for every booking, owner block, or maintenance period. Titles are optional: `BOOKED`, `OWNER BLOCK`, `MAINTENANCE`, or any other title all block availability. Even transparent events block nights on this dedicated calendar.

An all-day event from November 12 through exclusive end November 15 occupies nights November 12, 13, and 14. November 15 can be a new check-in date if no other event occupies that night. A visitor checking out on November 12 does not occupy the November 12 night, so that boundary is also allowed. Consecutive reservations are merged without freeing a shared occupied night.

Timed events conservatively block every property-local date they touch. An event ending exactly at local midnight leaves the new day free. An event ending at 11:00 AM blocks that local day's night; use all-day events with an exclusive end date for ordinary reservations. No unconfirmed same-day turnover time policy is invented.

Recurring events are expanded by Google with `singleEvents=true`, all pages are collected, and cancelled events are excluded. Date calculations use the configured timezone, including DST-aware range boundaries where that timezone observes DST.

## API and freshness

`GET /api/availability?from=YYYY-MM-DD&to=YYYY-MM-DD` returns only status, unavailable date ranges, requested bounds, timezone, configured minimum stay, and freshness/refresh information. The `to` boundary is exclusive. Requests are bounded to one year, pagination is bounded, and public traffic has an in-memory rate limit.

`fresh=1` bypasses the server cache. The enquiry form performs this check before preparing its message. An error at this stage prevents a prepared enquiry from being represented as checked; a separate Instagram link remains available to contact the host directly.

Default cache and browser refresh intervals are 60 seconds each. An owner update can therefore take roughly the combined cache and polling windows, plus upstream/network time, to appear. No instantaneous-sync promise is made. Expired cached availability is never returned when the upstream request fails.

In-memory caches and limits apply per server process. For a high-traffic multi-instance installation, use a shared cache and rate limiter at the hosting layer. Behind a reverse proxy, the default limiter sees the proxy's network address; use the host's trusted client-IP/rate-limit facilities rather than trusting arbitrary forwarded headers.

No Google Calendar writes or reservations are created. This read-only check is not a reservation lock. Direct confirmed bookings would require separate atomic conflict detection and persistence.

## Verification

`npm test` covers booked nights, checkout boundaries, multi-night stays, consecutive reservations, owner blocks, month-spanning events, timezone and DST boundaries, cancellations, empty calendars, API failures, stale cache rejection, a whole-operation timeout, fresh-check cache bypass, stale-response races, and privacy-safe responses. Browser tests cover calendar selection, unavailable nights, boundary checkout, keyboard controls, enquiry synchronization, responsive widths, and preview labeling.

Live credentials and access to an actual dedicated Google Calendar have not been tested; the owner requested dummy data for this version.
