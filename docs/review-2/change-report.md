The 4 November 2026 review changes were implemented locally against clean Git baseline `567026b` on 10 November 2026. No packages, dependency versions, API integrations, authentication, or database code were changed.

Implemented changes:

- Homepage: Archway now uses the supplied night exterior (`archway-53`); Aurania uses the supplied wider exterior (`aurania-8788`). Following the card-image correction, all three photographs use the same edge-to-edge `cover` treatment as Avante; responsive cropping fills the existing portrait frames without a hard image boundary or empty background band. Existing card dimensions, copy, links, Avante photograph, and villa detail photographs remain intact.
- Removed only “THE PLEASURE OF TAKING YOUR TIME” from the experience photograph.
- Added a photo-journal Instagram link using the configured `https://www.instagram.com/the_lit_stays/`. The existing footer and Our Story Instagram destinations remain intact.
- Added all five owner-supplied YouTube videos to the homepage, in responsive 9:16 players with controls, lazy loading, no autoplay, and direct YouTube links. No video section was added to Our Story. The two landscape source videos are contained by YouTube within vertical players; their source footage is not cropped or edited.
- Removed Gallery entries from desktop, mobile and footer navigation. The baseline had no standalone `/gallery/` route or sitemap entry; `/gallery/` returns 404. The homepage journal, its `#gallery` anchor and all villa-specific galleries remain available.
- After the owner approved the mock-up layout, applied the outline-only villa hero titles across Avante, Archway and Aurania. The fill is transparent, the title sits above the foreground mask, and the complete lettering fits desktop and mobile. Following the owner’s readability correction, the titles use a crisp white outline, the site’s existing Cormorant Garamond serif font and a subtle dark shadow. The responsive font sizes are unchanged.
- Added the exact four Food Rules as visible bullet points on all three villa pages through `VillaDining`. Existing package prices, meal lists, dining details and PDF controls remain intact.
- Normalised user-facing “The Lit Stays” text, metadata, accessible labels and enquiry greetings to “The LIT Stays”. No other wording was changed.

PDF optimization results (decimal MB):

| File | Before | After | Reduction |
| --- | ---: | ---: | ---: |
| `Avante.pdf` | 4.23 MB | 4.21 MB | 0.4% |
| `Archway.pdf` | 4.61 MB | 4.60 MB | 0.4% |
| `Villa Aurania.pdf` | 4.99 MB | 4.98 MB | 0.3% |
| `TLS - Food Package.pdf` | 26.65 MB | 9.60 MB | 64.0% |

Total PDF payload fell from 40.48 MB to 23.39 MB (42.2%). The villa PDFs were already optimized, so their reductions are small and lossless. Eight large food photographs were re-encoded at JPEG quality 88; text and vectors were not rasterised. All 63 PDF pages retain their word content, word positions, dimensions, links, document metadata and bookmarks. Villa pages render pixel-identically at 72 dpi. The food PDF’s largest per-page mean RGB difference is 0.7292 out of 255; all menu pages were visually compared and the pricing page inspected at full resolution. Existing PDF URLs and download filenames remain unchanged. Neither PDF viewer component nor any flipbook preview image was changed. Exact measurements and file hashes are in [pdf-validation.json](pdf-validation.json).

Inputs still required:

- Approved lifestyle/model photographs, their captions and alt text. The existing journal already reads typed `Photo` records from `src/lib/site-content.ts`; add approved photographs there and reference them in the six-photo sets in `src/lib/gallery-slides.ts`. Supply local responsive WebP variants at 480, 960, 1440 and 1920px for each photo ID, following the existing loader. All added photos appear in the existing lightbox and dynamic photo count. No stock or generated photographs were added.
- Approved additional questions and answers. Append them to the typed array in `src/lib/faqs.ts`; the existing FAQ maps the first four entries into the initial group and the remainder into `FAQMore`. Existing answers, disclosure behaviour and animations remain intact. No FAQ code change or placeholder content was necessary.

Files and components changed:

| File(s) | Purpose |
| --- | --- |
| `src/app/page.tsx` | Compose the homepage-only video section |
| `src/components/sections/HomeVideosSection.tsx`, `HomeVideosSection.module.css` (new) | Five responsive vertical YouTube players |
| `src/components/sections/VillaCardsSection.tsx`, `VillaCardsSection.module.css` | Local homepage photo overrides and consistent edge-to-edge image fitting |
| `src/components/sections/ExperienceSection.tsx` | Remove the specified overlay label |
| `src/components/sections/GallerySection.tsx` | Approved Instagram link beside the existing journal controls |
| `src/components/layout/Navbar.tsx`, `src/lib/site-content.ts` | Remove Gallery navigation; uppercase LIT |
| `src/components/villas/VillaDetail.tsx`, `VillaDetail.module.css`, `src/lib/villas.ts` | Approved outline layout and optional confirmed brand colour |
| `src/components/villas/VillaDining.tsx`, `VillaDining.module.css` | Shared visible Food Rules bullets |
| `src/components/layout/Footer.tsx`, `src/components/sections/PropertySections.tsx`, `BookingSection.tsx`, `src/components/villas/VillaEnquiry.tsx`, `src/app/layout.tsx`, `src/app/villas/[slug]/page.tsx` | LIT capitalisation only |
| `public/Avante.pdf`, `public/Archway.pdf`, `public/Villa Aurania.pdf`, `public/TLS - Food Package.pdf` | Validated PDF optimization at the existing paths |
| `scripts/serve.mjs` | Owner-approved static `.pdf` MIME mapping to `application/pdf`; no API or routing logic changed |
| `scripts/compress-pdfs.py` (new) | Reproducible compression candidates and content/render validation; requires the already-available PyMuPDF and Pillow |
| `tests/site.spec.ts`, `tests/villas.spec.ts` | Updated navigation checks and coverage for embeds, Food Rules, card image fitting and outlined title bounds |
| `docs/review-2/` (new) | This report, review-only CSS, screenshots and validation receipts |

Validation:

- Production build and TypeScript checks pass. All 18 existing availability unit tests pass.
- The selected development regression suite passed 35 checks before the final production run. The initial production run passed 34 of 36 checks. After the owner explicitly approved the one-entry PDF MIME mapping fix on 10 November 2026, the two previously failing checks were rerun against production and both passed. All 36 selected production checks are now verified. `scripts/serve.mjs` serves PDFs as `application/pdf`; API and routing logic remain untouched. The server script also passes Node syntax checking and targeted ESLint. The complete selected suite covers navigation, all villa pages, gallery interactions, mobile/desktop layouts, hero bounds, video aspect ratio, FAQ, availability, pinned heroes, manual and scroll-driven flipbook turns, and reduced-motion behaviour.
- Browser inspection of the production homepage and dining page recorded no application exceptions or failed requests. All five YouTube URLs returned HTTP 200 from the public oEmbed endpoint with author `The LIT Stays` and author URL `https://www.youtube.com/@thelitstays`; all five player previews rendered. See [youtube-validation.json](youtube-validation.json) and [browser-validation.json](browser-validation.json).
- All 73 unique local `href` and `src` targets in exported HTML exist. Homepage layout was checked from 320 through 1920px; the video players preserve 9:16 at 320, 390, 768 and 1440px.
- Full-project lint still reports the same baseline findings: `HeroSection.tsx:13` calls `Date.now` during render; `VillaEnquiry.tsx:16` sets state in an effect; `VillaBrochureBook.tsx:47` has an effect-cleanup ref warning. The affected new/changed feature files pass targeted ESLint. The `VillaEnquiry` wording-only edit retains its pre-existing lint error. These unrelated issues were not repaired.
- The initial development test attempt used `127.0.0.1`, which Next.js blocks as a development origin. Repeating with `localhost` resolved the interaction failures without changing configuration. Production checks use the existing production server at `localhost:3030`.

Review images: [Avante desktop](avante-hero-desktop.jpg), [Archway desktop](archway-hero-desktop.jpg), [Aurania desktop](aurania-hero-desktop.jpg), [Avante mobile](avante-hero-mobile.jpg), [Archway mobile](archway-hero-mobile.jpg), [Aurania mobile](aurania-hero-mobile.jpg), [Food Rules](dining-desktop.jpg), [video players](videos-desktop.jpg). The screenshots now show the implemented approved layout. `hero-title-proposal.css` is retained only as a review artifact and is not imported by the application.

No regressions caused by the requested edits have been identified. The pre-existing production PDF MIME issue was resolved by the explicitly approved static file-type mapping change; its production checks now pass. Each of the five embedded videos began muted playback after clicking YouTube’s accessible “Play video” button, with `readyState: 4`, `paused: false`, advancing playback time and no player errors. See [video-playback-validation.json](video-playback-validation.json). No hosted deployment was made; changes remain in this checkout for review.

The final compressed villa PDFs passed View, Download and modal checks on the development server, and the exact Food Rules passed on all three villas (2 targeted checks). The owner-approved, implemented production MIME fix is recorded in [pdf-mime-fix.diff](pdf-mime-fix.diff); it changes only the static file-type map. Production rerun: `LITSTAYS_BASE_URL=http://localhost:3030 npm run test:e2e -- tests/villas.spec.ts --grep 'each villa brochure previews|all three villas share brochure-priced'` — 2 passed. No production PDF verification blocker remains.

Card-image follow-up (10 November 2026): removed the `contain` override that caused Aurania and Archway photographs to stop halfway down their cards. All three images now fill their unchanged card frames using the existing `cover` styling. The supplied image sources, text, gradients, links and card dimensions remain intact. Production build, targeted ESLint and both homepage checks pass, including image loading and overflow checks at 320–1920px. Desktop and mobile crops were visually inspected: [desktop cards](cards-desktop.jpg), [Aurania mobile](cards-mobile-aurania.jpg), [Archway mobile](cards-mobile-archway.jpg).

Hero-title readability follow-up (10 November 2026): the owner requested white lettering and a different font while retaining the existing font size. Changed only the villa hero typography to the existing Cormorant Garamond serif, white outline and subtle dark shadow. The transparent fill, hero imagery, responsive font-size rules and rest of each page remain intact. Production build and targeted ESLint pass. Both hero checks pass across all three villas, including 320, 390, 768, 1024 and 1440px widths, exact preserved font sizes, complete title bounds and pinned-hero behaviour. Latest previews: [desktop white serif title](archway-white-title-desktop.jpg), [mobile white serif title](archway-white-title-mobile.jpg). White supersedes the earlier provisional forest outline; villa colour codes are no longer required for the current requested treatment.

Latest owner-requested refinements (10 November 2026):

- Villa hero names now use the locally hosted **Montserrat 600** font in solid white. Original responsive font-size values are preserved, and the complete title group is vertically centered on all three villa heroes. The font file and OFL license are in `public/fonts/montserrat-latin-600.woff2` and `public/fonts/licenses/montserrat-OFL.txt`.
- Homepage and villa heroes cycle their own existing approved photos with a 5-second hold and 1.2-second crossfade. The next photo decodes before fading in; failed photos are skipped. Slides stop while the tab is hidden, while the hero is covered by page content, and with reduced motion. No hero pause/play buttons remain, as requested. `VillaHeroSlideshow.tsx` and its CSS provide the shared behaviour; homepage and villa composition use it without changing booking controls or page content.
- Homepage imagery has no image filter. Its green overlay is exactly **10%**, per the latest instruction, replacing the stronger original tint. This is localized to `src/app/hero.css`.
- The film section follows the supplied reference: two complete **16:9 Videos** and three **9:16 Shorts**, with approved villa covers, separate row introductions, and no divider line or side-arrow controls. Shorts are grouped with an 18px desktop gap rather than spread across the available width. Mobile rows fit without cropped cards or horizontal page overflow.
- A top-right leaf watermark uses the existing `/images/intro-leaves.webp` artwork at exactly **40% opacity**. No other watermark was altered.
- Each film/Short starts **muted playback on mouse hover** and pauses on mouse leave. A touch or keyboard click can start playback as well. YouTube players mount only on first interaction and retain their position while paused. The actual five public videos were tested: every video advanced while hovered (`readyState: 4`, `muted: true`, `paused: false`) and reported `paused: true` after leaving, with no application errors. See [hover-playback-validation.json](hover-playback-validation.json).
- Model/lifestyle photographs have been requested for the rest of the website, excluding the film section. No approved model photo collection was found in project assets or connected Drive searches for LIT Stays folders/images. The owner has been asked for the approved folder path or Drive link. This asset-dependent change remains pending; no stock, generated or guessed replacement photos were added, and film covers remain unchanged.

Verification of these refinements: production build, TypeScript and targeted ESLint pass. The production run covered 39 checks: 37 initially passed; one mobile Shorts width issue was fixed and its failed check passed on rerun. All 38 relevant UI, gallery, PDF and slideshow checks are now verified, including exact Montserrat family, preserved title sizes, centering, image failure recovery, reduced motion, no hero playback buttons, hover play/pause, whole video frames, and desktop/mobile layouts. The existing enquiry test is date-sensitive: on 10 November its “today + 10 days” input selects 20–22 November, which intersects the existing demo block on 21–22 November. The application correctly rejects those sample dates. No booking or availability code was changed to bypass this unrelated fixture issue.

Latest previews: [homepage hero desktop](home-hero-final-desktop.jpg), [homepage hero mobile](home-hero-final-mobile.jpg), [centered white Montserrat desktop](montserrat-centered-desktop.jpg), [centered white Montserrat mobile](montserrat-centered-mobile.jpg), [film section desktop](film-final-desktop.jpg), [film section mobile](film-final-mobile.jpg). Earlier serif/outline mock-ups are historical review artifacts; the latest white Montserrat previews show the current treatment.
