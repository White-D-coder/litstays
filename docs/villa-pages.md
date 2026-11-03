# Individual villa pages

Each entry in `src/lib/villas.ts` generates `/villas/<slug>/`, a navigation link, and a sitemap entry. Add the next villa to this array using the `Villa` type. All entries share `VillaDetail.tsx`, `VillaDining.tsx`, `VillaGallery.tsx` and their CSS modules.

Keep prices, refundable deposits, food packages, amenities and bedroom counts specific to that villa. Villa pages have no enquiry form or availability calendar. Their remaining contact links go directly to the existing Instagram message destination. Prices, deposits and food are optional: when not supplied, the template asks guests to enquire for a quotation and omits unconfirmed amounts. Archway uses this mode for its stay price and deposit.

Put a supplied property photograph in `public/images/` and add `heroImage` to the villa entry:

```ts
heroImage: {
  src: '/images/villa-avante.webp',
  alt: 'Villa Avante at sunset',
  width: 1280,
  height: 1600,
},
```

All three villas use their own supplied photographs, compressed to WebP. The full-width hero has an oversized villa name behind the architecture, a compact cream panel with location, bedroom and pool details and one enquiry link. An extended sky and a feathered photo edge give the name room above the building. Text remains static.

Optional `position` and `mobilePosition` fields control each photograph’s focal point (CSS `object-position` values). `foregroundMask` points to a manually drawn SVG silhouette matching the hero photo’s aspect ratio; the masked duplicate places the building in front of the title. `sky` sets the extended sky’s colour. Keep the foreground and background crops aligned. Do not substitute another property’s photographs.

Run `npm run build` after adding a villa so the static export includes its page.

## Avante photo collection

`public/avante/` contains the 42 supplied JPEG originals. `src/lib/avante-photos.ts` lists their captions, alt text and display order. Five selected photos introduce the collection; the villa gallery opens every photo in a keyboard- and swipe-accessible viewer with a thumbnail rail.

Run `node scripts/prepare-avante-images.mjs` after replacing an original. It preserves the JPEGs and creates 480, 960, 1440 and 1920 pixel WebP versions in `public/avante/optimized/`. Components use `villa-image-loader.ts` to select the appropriate width; pages never need to download the original JPEGs. Avante’s hero uses exterior photo 38.

The shared template shows `VillaGallery` when a villa has a `photos` array. Add another villa’s own collection there when supplied; photos are never shared between properties implicitly.

## Aurania photo collection

`public/aurania/` contains 75 readable JPEGs and three HEIC originals. `src/lib/aurania-photos.ts` orders and describes the 75 JPEGs. The hero uses photo 8806. The three HEIC maintenance photographs remain preserved outside the guest gallery.

Run `node scripts/prepare-villa-images.mjs aurania` to regenerate the four responsive WebP sizes in `public/aurania/optimized/`.

## Archway photo collection

`/villas/villa-archway/` uses the same template, with confirmed three-bedroom, four-bathroom, private-pool and 20-guest details from the existing homepage. The stay price and deposit remain unset until supplied. Dining uses the supplied shared food brochure.

`src/lib/archway-photos.ts` contains 66 unique photos from `public/archway/`: 61 property photographs and five aerial views. The five `(1)` aerial originals are byte-identical duplicates and appear once in the gallery. The supplied MP4 remains untouched. The hero uses property photo 54.

Run `node scripts/prepare-villa-images.mjs archway` to regenerate the four responsive WebP sizes in `public/archway/optimized/`. Both preparation commands preserve the original files.

## Brochures and dining

Every villa record has a `brochure` containing the original PDF URL, download filename, cover image and page count. `PdfBrochure.tsx` opens it in an on-page dialog with a PDF iframe, download and new-tab fallback. PDF files load only when opened, preserving page load performance. Escape/Close restores focus to the view button.

The original files remain at `/Archway.pdf`, `/Avante.pdf`, `/Villa%20Aurania.pdf` and `/TLS%20-%20Food%20Package.pdf`. Do not replace them with rendered image copies.

`VillaDining.tsx` is shared by all three pages. Prices in `src/lib/dining.ts` follow food brochure pages 3–8: Veg Classic ₹1,400, Veg Premium ₹1,650, Non-Veg Classic ₹1,600 and Non-Veg Premium ₹1,900 per person/day. Premium packages require five guests. Menu confirmation, advance payment and dietary information are available in an expandable note and the complete brochure. The displayed food packages range from ₹1,400 to ₹1,900.

The food photograph is extracted from image 730 in the supplied PDF, with responsive WebP derivatives in `public/brochures/`. The original villa cover thumbnails are preserved; brochure access now uses inline text links. Photo reveal, hover zoom, price fades and brochure fades respect reduced-motion preferences; text positions stay fixed.

## Minimal villa layout and scrolling

The hero uses `position: sticky; top: 0; height: 100svh`. `#villa-content` is an opaque ivory sheet in normal document flow, layered above it. It contains the introduction/price, gallery, comforts, dining and footer, and scrolls over the hero. Do not put overflow or a transform on the hero’s parent: that would change the sticky scroll container.

`#nav-sentinel` is outside the sticky hero, positioned at the top of the document. It lets navigation change to its light appearance when the content approaches the header, even though the hero stays visible behind it.

The introduction and quotation share one section. Villa brochures are View/Download links within its lower rule. Amenities use a property photo and native disclosure rows, with one detail open at a time. There is no green amenities band, brochure promotion card or bottom enquiry form. Text stays fixed while photographs reveal; primary copy is 14–18px or larger.

## Our Story

`/our-story/` is linked in navigation and the sitemap. The page introduces the company, includes the founder Hardik Panchal, and links to all three villas. `src/lib/our-story.ts` holds the editable company paragraphs and founder details. It uses confirmed facts only; expand the founder biography when supplied. The founder graphic is an HP brand monogram, not a portrait.
