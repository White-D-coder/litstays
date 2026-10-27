# Measured performance

Measured on 28 October 2026 with Lighthouse 13.5.0 in local Chrome against the compressed production build. Mobile uses Lighthouse's standard simulated mobile throttling; desktop uses its desktop preset. These are laboratory measurements, not field measurements or hosting guarantees.

| Category | Mobile | Desktop |
| --- | ---: | ---: |
| performance | 88 | 100 |
| accessibility | 100 | 100 |
| best-practices | 100 | 100 |
| seo | 100 | 100 |

| Metric | Mobile | Desktop |
| --- | --- | --- |
| first-contentful-paint | 0.8 s | 0.2 s |
| largest-contentful-paint | 3.9 s | 0.8 s |
| cumulative-layout-shift | 0 | 0 |
| total-blocking-time | 70 ms | 0 ms |
| speed-index | 0.8 s | 0.3 s |
| total-byte-weight | Total size was 795 KiB | Total size was 841 KiB |

There was no measured layout shift. Mobile LCP remains above the 2.5-second target under simulated throttling. Further improvements would focus on the hero font/rendering path and initial framework JavaScript; cache and CDN behavior should be remeasured on the intended public host. TBT is reported as measured; it is not a field INP measurement.

The static page uses responsive local WebP assets, an independently cropped portrait hero, high-priority hero image loading, lazy images below the fold, self-hosted WOFF2 fonts, and compressed assets. The availability calendar is loaded as a separate client component.

See performance-summary.json for numeric values. The production build, lint, type checks, 18 calendar unit tests, and nine browser tests passed. Browser tests cover ten viewport widths, image loading, overflow, sticky hero, menu and lightbox focus, enquiries, calendar selection, FAQ disclosures, reduced motion, and the no-JavaScript contact fallback.
