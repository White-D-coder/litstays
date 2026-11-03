import type { VillaPhoto } from './villas';

const groups: { numbers: number[]; category: string; caption: string; alt: string }[] = [
  { numbers: [8774, 8814, 8831, 8832], category: 'The bedrooms', caption: 'Make yourself at home', alt: 'Villa Aurania’s bedroom with a double bed, curtained window and wooden wardrobe' },
  { numbers: [8776, 8778, 8801], category: 'Rain dance', caption: 'A little dancing in the rain', alt: 'Overhead rain-dance showers beside the villa and garden' },
  { numbers: [8779, 8800], category: 'The Jacuzzi', caption: 'Time to unwind', alt: 'Villa Aurania’s blue-tiled outdoor Jacuzzi surrounded by greenery' },
  { numbers: [8780, 8782, 8840, 8841], category: 'The veranda', caption: 'Stay for one more conversation', alt: 'Tables and chairs on the covered veranda overlooking the garden' },
  { numbers: [8785, 8786, 8789, 8790, 8791, 8792, 8793], category: 'The garden', caption: 'A little room to breathe', alt: 'Villa Aurania’s leafy garden with a stepping-stone path and colourful outdoor seating' },
  { numbers: [8787, 8788, 8794, 8802, 8803, 8804, 8806], category: 'The arrival', caption: 'A warmer welcome', alt: 'Villa Aurania’s red-roofed exterior, entrance veranda and surrounding trees' },
  { numbers: [8805, 8866, 8869, 8873], category: 'The kitchen', caption: 'The everyday essentials', alt: 'Kitchen appliances, worktops and utensils provided at Villa Aurania' },
  { numbers: [8807, 8808, 8809], category: 'Inside the villa', caption: 'Find your own little corner', alt: 'Villa Aurania’s staircase with a metal handrail and warm-toned walls' },
  { numbers: [8810, 8811, 8812, 8813, 8816, 8817], category: 'The bathrooms', caption: 'Refresh and reset', alt: 'A tiled bathroom with a shower, basin and toilet at Villa Aurania' },
  { numbers: [8815, 8862], category: 'The bedrooms', caption: 'Settle in', alt: 'A wooden wardrobe and storage space in a Villa Aurania bedroom' },
  { numbers: [8818, 8819, 8820, 8821, 8822], category: 'The bedrooms', caption: 'A slower start', alt: 'A sunlit bedroom with low beds, warm wooden flooring and a large window' },
  { numbers: [8823, 8824, 8825, 8826, 8827, 8828, 8829, 8830], category: 'The living spaces', caption: 'Room for your favourite people', alt: 'Villa Aurania’s spacious living room with wooden sofas, colourful curtains and dining space' },
  { numbers: [8834, 8835, 8836, 8837, 8838, 8839], category: 'After sunset', caption: 'Let the evening linger', alt: 'Villa Aurania’s exterior and garden illuminated with warm lights after sunset' },
  { numbers: [8842, 8843, 8844, 8845], category: 'The bedrooms', caption: 'At the end of a good day', alt: 'A softly lit Villa Aurania bedroom with beds and curtains drawn for the evening' },
  { numbers: [8859], category: 'The essentials', caption: 'Stay connected', alt: 'The wireless router provided inside Villa Aurania' },
  { numbers: [8860], category: 'The essentials', caption: 'A little extra comfort', alt: 'An air-conditioning unit above a bedroom window' },
  { numbers: [8861], category: 'The details', caption: 'Little things, everywhere', alt: 'A framed artwork on a warm-toned interior wall' },
  { numbers: [8863, 8864, 8867], category: 'The exterior', caption: 'Around the villa', alt: 'Exterior security cameras and signage at Villa Aurania' },
  { numbers: [8865], category: 'Time together', caption: 'Set the mood', alt: 'A Bluetooth speaker with coloured lights provided for guests' },
  { numbers: [8868], category: 'The essentials', caption: 'A little peace of mind', alt: 'A power-backup unit inside Villa Aurania' },
  { numbers: [8870], category: 'Time together', caption: 'A little friendly competition', alt: 'A foosball table on Villa Aurania’s covered outdoor veranda' },
  { numbers: [8872], category: 'The essentials', caption: 'Taken care of', alt: 'A water-storage tank beside the villa' },
];

const all = groups.flatMap(group => group.numbers.map(number => ({
  id: `aurania-${number}`, src: `/aurania/optimized/aurania-${number}-1920.webp`,
  category: group.category, caption: group.caption, alt: group.alt, responsive: true,
})));
const featured = [8806, 8827, 8820, 8800, 8780].map(number => `aurania-${number}`);
export const auraniaPhotos: VillaPhoto[] = [
  ...featured.map(id => all.find(photo => photo.id === id)!),
  ...all.filter(photo => !featured.includes(photo.id)).sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true })),
];
