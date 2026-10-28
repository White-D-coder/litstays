import { photos } from './site-content';

// Six masonry frames; each photograph keeps its matching caption.
export const galleryScenes = [
  { photos: [photos[3], photos[4], photos[6], photos[1], photos[2], photos[0]], note: 'Some places feel like a beginning.' },
  { photos: [photos[0], photos[1], photos[2], photos[8], photos[5], photos[7]], note: 'Good company. Nowhere else to be.' },
  { photos: [photos[8], photos[5], photos[7], photos[3], photos[4], photos[6]], note: 'Leave a little of the everyday behind.' },
];

export const galleryMotion = { holdMs: 5200, crossfadeMs: 1400, imageTimeoutMs: 12000 };
