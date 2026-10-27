# The Lit Stays

A complete editorial hospitality website, built with Next.js App Router, TypeScript, Motion, and responsive local photography. Instrument Serif and Manrope are self-hosted WOFF2 fonts; their OFL licenses are included under `public/fonts/licenses`.

## Run and verify

Use Node.js 22.19 or newer and npm.

```sh
npm ci
npm run dev
```

The development launcher finds available ports, starts Next.js, and starts the availability API separately. Open the Local URL printed by Next.js.

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm start
```

`npm start` serves the exported production website and `/api/availability` together, with compression and appropriate cache headers. Its default address is `http://localhost:3000`. Set `PORT` to use a different port; set `LITSTAYS_HOST=0.0.0.0` when deploying behind a production host's reverse proxy.

Browser verification uses an existing local Chrome installation:

```sh
# Start npm start in another terminal first.
npm run test:e2e
```

Set `LITSTAYS_CHROME` to the browser executable on other systems. Set `LITSTAYS_BASE_URL` if the production preview uses another port. Playwright tests are scoped to `*.spec.ts`; calendar unit tests use the Node test runner separately.

## Experience implemented

- Viewport-filling hero with an art-directed portrait crop, mask reveals, a subtle scroll response, and a sticky photograph that stays stationary as the ivory content moves over it.
- Responsive navigation with a native modal mobile menu, Escape handling, restored focus, and a background transition over the content.
- Redesigned editorial introduction, asymmetrical property photographs, a separate bungalow story, bedrooms and pool imagery, and an interactive experience panel.
- Redesigned property facts combining a large photograph with a compact specification sheet.
- A nine-photo lightbox with arrow keys, Escape, touch swipes, and focus restoration.
- Location, directions, FAQ, availability calendar, enquiry preparation, and footer.
- The supplied HomeFAQ layout and disclosure behavior: sticky desktop introduction, four initial questions, exclusive native disclosures, manual desktop expansion, and phone scroll expansion/collapse. Answer-height and toggle animations respect reduced motion.
- Responsive layouts checked at 320, 360, 375, 390, 430, 768, 1024, 1280, 1440, and 1920 px, without horizontal overflow or broken images.

## Availability and enquiries

The current preview deliberately shows **sample availability**. These dates are identified as sample data in the calendar, explanatory text, and prepared enquiry. No real Google Calendar is connected yet, per the request to use dummy data.

The live integration is implemented in `server/availability-service.ts` and exposed by `server/availability-api.ts`. It uses the official Google authentication library, a read-only service account, recurrence expansion, paginated event retrieval, property-local date normalization, bounded caching, timeout/error handling, and a fresh availability check before preparing an enquiry. It returns unavailable ranges rather than private event details.

See [Google Calendar setup](./docs/calendar-setup.md) and [.env.example](./.env.example) to activate it. Live Google authentication and actual property-calendar access remain unverified until credentials and the dedicated private calendar are configured.

The enquiry flow validates name, contact, dates, occupied nights, and guest count. It prepares a message for the official Instagram account supplied in the original brief. The visitor must copy and send the message; the site never claims that an enquiry was submitted or a reservation was confirmed. An owner-verified WhatsApp number or email can be added in `src/lib/site-content.ts`; the corresponding encoded destination is already supported.

The current private Sites deployment serves the static `out/` build in sample mode. Live availability needs either the included Node production server or a separately deployed copy of the availability API. With a separate API, configure `NEXT_PUBLIC_AVAILABILITY_API_URL` and its explicit CORS allowlist, then rebuild the frontend. A static-only host does not run the Node API.

## Content and provenance

The featured property is **Villa Archway**, one of the brand's host-published listings. Instagram could not be fetched during the build. The host's [Villa Archway listing](https://www.airbnb.co.uk/rooms/1728587845573584919) supplied the actual property imagery, Virar East location, three bedrooms, four bathrooms, private pool, and exclusive-property access. Original image URLs are recorded in `scripts/image-sources.json`; all website images are served locally.

The owner subsequently supplied screenshots confirming Villa Archway's capacity of up to 20 guests, check-in from 1:00 PM, check-out by 11:00 AM, and the FAQ content for Villa Archway, Villa Avante, and Villa Aurania. The FAQs reproduce the supplied meal options, prices, pet policy, pool differences, Wi-Fi, parking, and celebration/decorating policy.

Remaining business information: official WhatsApp/email, exact arrival address, nightly rates, any owner-defined minimum stay, and the dedicated calendar plus server credentials. These are not invented or published as guessed values.

## Source map

| Path | Responsibility |
| --- | --- |
| `src/app/page.tsx`, `layout.tsx`, `globals.css` | Page composition, metadata, fonts, responsive art direction |
| `src/components/layout/` | Navigation, mobile menu, footer |
| `src/components/sections/HeroSection.tsx` | Sticky hero and scroll-linked motion |
| `src/components/sections/PropertySections.tsx` | Introduction, property spread, spaces, facts, location |
| `src/components/sections/ExperienceSection.tsx` | Interactive moments and corresponding photography |
| `src/components/sections/GallerySection.tsx` | Accessible photo lightbox |
| `src/components/sections/FAQSection.tsx`, `FAQMore.tsx` | Supplied FAQ layout and phone scroll behavior |
| `src/components/sections/AvailabilitySection.tsx` | Calendar introduction and preview disclosure |
| `src/components/availability/` | Shared selected dates and responsive keyboard calendar |
| `src/components/sections/BookingSection.tsx` | Validation, fresh availability check, enquiry preview and copy |
| `src/lib/site-content.ts`, `faqs.ts` | Business content and owner-provided FAQs |
| `src/lib/availability-rules.ts`, `availability-client.ts` | Shared date rules, demo data, safe client requests |
| `server/availability-service.ts`, `availability-api.ts` | Private Google Calendar access, cache, public endpoint |
| `scripts/serve.mjs`, `dev.mjs` | Production and development runtime |
| `scripts/prepare-images.mjs` | Reproducible responsive WebP preparation |
| `tests/` | Calendar edge cases and browser interaction checks |

## Performance and limits

Actual Lighthouse measurements from the local compressed production build are recorded in [the performance report](./docs/performance.md). These are laboratory measurements, not field Core Web Vitals or guarantees for other hosting environments. No field INP measurement is claimed.

The website has no payment collection, direct reservation creation, availability lock, or calendar writes. Availability checks do not prevent someone else booking concurrently. No Google push notifications are configured; updates use short polling and server cache expiry.
