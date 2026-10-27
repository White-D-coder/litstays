# Villa explorer

The bungalow and spaces are now one section, implemented in `src/components/sections/VillaSpacesSection.tsx`. Its `spaces` array contains the four photographs, tab labels, titles, descriptions and notes.

Styles are in `src/app/villa-spaces.css`. The variables at the top control the desktop photo height, photo-to-copy width ratio and text padding. Mobile stacks the photo above the text. The original `#bungalow` navigation and `#spaces` anchor still work.

Photos crossfade after the selected image finishes decoding. Arrow keys, Home and End navigate the tabs. The photo frame stays the same size across choices. Scroll entrances fade the heading and copy gently; reduced-motion preferences show the content immediately and disable photo transitions. Without JavaScript, the living-room photograph and story remain visible.
