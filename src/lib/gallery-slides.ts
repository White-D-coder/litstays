import { photos } from './site-content';

// Each row fills the large frame, upper small frame, then lower small frame.
export const galleryScenes = [
  { photos: [photos[3], photos[4], photos[6]], note: 'Some places feel like a beginning.' },
  { photos: [photos[0], photos[1], photos[2]], note: 'Good company. Nowhere else to be.' },
  { photos: [photos[8], photos[5], photos[7]], note: 'Leave a little of the everyday behind.' },
];

export const galleryMotion = { holdMs: 5200, crossfadeMs: 1400, imageTimeoutMs: 12000 };
