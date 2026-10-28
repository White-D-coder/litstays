# Introduction photo and text motion

The arched photo frame cycles through the balcony, bedroom, living room, pool and terrace. Its current dimensions, heading, paragraphs and line breaks are retained.

## Photo order and timing

Edit `src/lib/intro-slides.ts`:

- `introSlides`: reorder or replace the existing property photographs.
- `holdMs`: how long a loaded photograph stays before the next transition, currently 4200 ms.
- `crossfadeMs`: the opacity transition, currently 1200 ms.
- `imageTimeoutMs`: abandon an incoming image that does not finish loading, currently 12000 ms.

The current photo remains visible while the next image loads and decodes. Only then does the incoming image fade over it. A failed incoming image is skipped while the previous photo remains on screen. Only the current and incoming slides are mounted.

Autoplay runs while the frame is in view and the browser tab is visible. Hovering pauses it temporarily. The photos have no visible counter or navigation buttons. Reduced-motion preferences keep the first photo static and disable opacity transitions.

## Image position

Edit `src/app/intro-slideshow.css`. `--intro-image-scale`, `--intro-image-x`, `--intro-image-y` and `--intro-image-position` affect the photos inside the reserved frame, keeping the text layout independent.

## Title and paragraph entrance

`src/components/ui/IntroFade.tsx` fades each existing text element in once on entering the viewport. Delays and durations are set on the `IntroFade` calls in `IntroductionSection`, in `src/components/sections/PropertySections.tsx`. The animation uses opacity and a gentle 10 px translation, without changing font size, line breaks or document layout. Reduced motion shows the text immediately. Without JavaScript, the text and first photo remain visible.

The supplied leaf artwork is now a low-contrast, inverted watermark behind the photo frame. Its opacity, size and rotation are defined by `.intro-leaf-watermark` in `src/app/editorial-update.css`. The photograph and text layout remain independent.
