# Villa explorer

The bungalow and spaces are now one section, implemented in `src/components/sections/VillaSpacesSection.tsx`. Its `spaces` array contains the four photographs, tab labels, titles, descriptions and notes.

Styles are in `src/app/villa-spaces.css`. The variables at the top control the desktop photo height, photo-to-copy width ratio and text padding. Phones retain the two facing scrapbook pages. The original `#bungalow` navigation and `#spaces` anchor still work.

The warm paper spread uses a 3D page flap after the selected image finishes decoding, with subtle brand watermarks. The complete spread stays pinned for four scroll chapters on laptops and phones. The next section follows after the final chapter; scrolling back reverses the pages. Shorter screens use a more compact spread rather than disabling scroll changes. Arrow keys, Home and End navigate the tabs. The photo frame stays the same size across choices. Reduced-motion preferences disable sticky scrolling and page turns, while retaining manual tab navigation. Without JavaScript, the living-room photograph and story remain visible.

The heading and introduction now belong to the same sticky spread as the tabs, pages and footer. `editorial-update.css` sizes and vertically centers the complete composition; compact two-page layouts are retained on phones. All headings use upright Cormorant Garamond and natural wrapping.

`--villa-page-distance` in `src/app/editorial-update.css` controls the distance per chapter (at least 320 px, or 68% of the viewport height). All four photographs preload as the section approaches. Reduced motion keeps the regular document flow and manual navigation.
