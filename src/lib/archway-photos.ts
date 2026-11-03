import type { VillaPhoto } from './villas';

const groups = [
  { numbers: [1, 2, 4, 5, 6, 7, 9], category: 'The bedrooms', caption: 'Nowhere to rush to', alt: 'Villa Archway’s warm bedroom with a low bed, arched windows and green views' },
  { numbers: [3, 8], category: 'The bedrooms', caption: 'Little moments of comfort', alt: 'Drinks, cushions and guest comforts arranged on a Villa Archway bed' },
  { numbers: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19], category: 'Time together', caption: 'A little friendly competition', alt: 'Villa Archway’s games room with blue sofas, game tables and large windows overlooking trees' },
  { numbers: [20, 21, 22, 23], category: 'Time together', caption: 'One more round', alt: 'Darts and card games ready for guests in the Villa Archway games room' },
  { numbers: [24, 25, 26, 27, 28], category: 'The living spaces', caption: 'Room for good company', alt: 'Villa Archway’s open living and dining area with arched windows, a kitchen and neutral sofas' },
  { numbers: [29, 30, 31, 32], category: 'The pool', caption: 'Take the afternoon off', alt: 'The private blue swimming pool, water feature and outdoor seating at Villa Archway' },
  { numbers: [33, 34], category: 'The pool', caption: 'An evening dip', alt: 'Villa Archway’s swimming pool and courtyard illuminated after sunset' },
  { numbers: [35, 36, 37, 38], category: 'The balcony', caption: 'Your morning, unhurried', alt: 'Woven balcony chairs and a small round table surrounded by green trees' },
  { numbers: [39, 40, 41], category: 'The terrace', caption: 'Let the evening linger', alt: 'The open rooftop terrace, outdoor seating and warm wall lights beneath an evening sky' },
  { numbers: [42, 43, 44], category: 'The terrace', caption: 'Under an open sky', alt: 'Villa Archway’s rooftop terrace in daylight with trees and hills in the distance' },
  { numbers: [45, 46, 47, 48, 49, 50], category: 'The arrival', caption: 'Leave the everyday at the door', alt: 'Villa Archway’s entrance passage with potted plants, arched windows and a green walkway' },
  { numbers: [51, 52], category: 'The architecture', caption: 'Some places stay with you', alt: 'Villa Archway and its neighbouring villa with gates, balconies and warm stone facades' },
  { numbers: [53, 54], category: 'The architecture', caption: 'A warm arrival', alt: 'Villa Archway’s arched facade, black gate and balconies framed by palms' },
  { numbers: [55, 56, 57, 58], category: 'The bathrooms', caption: 'Refresh and reset', alt: 'A stone-finished bathroom with an illuminated mirror, vanity and shower at Villa Archway' },
  { numbers: [59], category: 'The essentials', caption: 'One less thing to pack', alt: 'Guest toiletries and towels arranged on a tray at Villa Archway' },
  { numbers: [60, 61], category: 'The essentials', caption: 'A little peace of mind', alt: 'A first-aid kit provided for Villa Archway guests' },
];
const all: VillaPhoto[] = groups.flatMap(group => group.numbers.map(number => ({
  id: `archway-${number}`, src: `/archway/optimized/archway-${number}-1920.webp`,
  category: group.category, caption: group.caption, alt: group.alt, responsive: true,
})));
const featured = [29, 6, 27, 14, 39].map(number => `archway-${number}`);
export const archwayPhotos: VillaPhoto[] = [
  ...featured.map(id => all.find(photo => photo.id === id)!),
  ...all.filter(photo => !featured.includes(photo.id)),
  ...[1, 2, 3, 4, 5].map(number => ({
    id: `archway-aerial-${number}`, src: `/archway/optimized/archway-aerial-${number}-1920.webp`,
    category: 'From above', caption: 'A little closer to nature',
    alt: 'An aerial view of Villa Archway and the neighbouring villa surrounded by trees and hills', responsive: true,
  })),
];
