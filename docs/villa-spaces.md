# Villa explorer

The bungalow and spaces are now one section, implemented in `src/components/sections/VillaSpacesSection.tsx`. Its `spaces` array contains the four photographs, tab labels, titles, descriptions and notes.

Styles are in `src/app/villa-spaces.css`. The variables at the top control the desktop photo height, photo-to-copy width ratio and text padding. Mobile stacks the photo above the text. The original `#bungalow` navigation and `#spaces` anchor still work.

The warm paper spread uses a 3D page flap after the selected image finishes decoding, with subtle brand watermarks. On screens tall enough for the complete spread, it stays in view while scrolling turns its four pages. Shorter screens use a normal document flow and manual tabs. Arrow keys, Home and End navigate the tabs. The photo frame stays the same size across choices. Reduced-motion preferences disable sticky scrolling and page turns, while retaining manual tab navigation. Without JavaScript, the living-room photograph and story remain visible.

The heading and introduction now belong to the same sticky spread as the tabs, pages and footer. `editorial-update.css` sizes and vertically centers the complete composition; compact two-page layouts are retained on phones. All headings use upright Cormorant Garamond and natural wrapping.
