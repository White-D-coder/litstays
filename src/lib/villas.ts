import { avantePhotos } from './avante-photos';
import { auraniaPhotos } from './aurania-photos';
import { archwayPhotos } from './archway-photos';
import { villaDining } from './dining';

export type VillaPhoto = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  category: string;
  responsive?: boolean;
};

export type Villa = {
  slug: string;
  name: string;
  style: string;
  bedrooms: number;
  hasPool: boolean;
  location: string;
  introduction: string;
  description: string;
  heroImage?: { src: string; alt: string; width: number; height: number; position?: string; mobilePosition?: string; mobileScale?: number; responsive?: boolean; foregroundMask?: string; sky?: string };
  photos?: VillaPhoto[];
  brochure: { href: string; filename: string; cover: string; pages: number };
  stayPrice?: number;
  refundableDeposit?: number;
  priceIncludes?: string;
  amenities: { name: string; detail: string }[];
  food?: { minPrice: number; maxPrice: number; meals: string[]; description: string };
  host: { name: string; role: string };
};

// Add the next villa here. Its route, navigation link and sitemap entry are
// generated from this record, using the same VillaDetail layout.
// heroImage accepts a real property photo in public/, e.g.
// { src: '/images/villa-avante.webp', alt: 'Villa Avante at sunset', width: 1280, height: 1600 }.
export const villas: Villa[] = [
  {
    slug: 'villa-avante',
    name: 'Villa Avante',
    style: 'Balinese villa',
    bedrooms: 2,
    hasPool: true,
    location: 'Virar East',
    introduction: 'A little Bali. A little closer.',
    description: 'Balinese spaces, poolside afternoons and time with your favourite people. A private two-bedroom escape.',
    heroImage: { src: '/avante/optimized/avante-38-1920.webp', alt: 'Villa Avante’s illuminated entrance and balconies under a blue evening sky', width: 1920, height: 1282, position: 'center top', mobilePosition: '51% top', responsive: true, foregroundMask: '/images/avante-hero-mask.svg', sky: '#075491' },
    photos: avantePhotos,
    brochure: { href: '/Avante.pdf', filename: 'Avante.pdf', cover: '/brochures/avante-cover.webp', pages: 18 },
    stayPrice: 18000,
    refundableDeposit: 8000,
    priceIncludes: 'The price includes the stay and amenities only.',
    amenities: [
      { name: 'Swimming pool', detail: 'Make a little room for pool time.' },
      { name: 'Netflix on TV', detail: 'Settle in with something good to watch.' },
      { name: 'Music & karaoke', detail: 'Bluetooth speaker with a wireless microphone.' },
      { name: 'Indoor games', detail: 'Foosball, playing cards, table tennis, pool table, ludo, chess, darts, couple cards and drinking cards.' },
      { name: 'Air conditioning', detail: 'AC in all bedrooms and the hall.' },
      { name: 'Microwave', detail: 'For a quick warm-up whenever you need it.' },
      { name: 'Refrigerator', detail: 'Keep your refreshments chilled.' },
      { name: 'Power backup', detail: 'A little extra peace of mind.' },
      { name: 'Cutlery', detail: 'The everyday dining essentials.' },
      { name: 'Towels', detail: 'One less thing on your packing list.' },
      { name: 'Toiletries', detail: 'The essentials for your stay.' },
    ],
    food: villaDining,
    host: { name: 'Hardik Panchal', role: 'Founder' },
  },
  {
    slug: 'villa-aurania',
    name: 'Villa Aurania',
    style: 'Luxury villa',
    bedrooms: 2,
    hasPool: false,
    location: 'Virar East',
    introduction: 'A little luxury. A lot of together.',
    description: 'A private Jacuzzi, rain dance and a garden to slow down in. A two-bedroom retreat without a pool.',
    heroImage: { src: '/aurania/optimized/aurania-8806-1920.webp', alt: 'Villa Aurania’s red-roofed exterior and entrance courtyard surrounded by trees', width: 1920, height: 1280, position: 'center top', mobilePosition: '58% top', responsive: true, foregroundMask: '/images/aurania-hero-mask.svg', sky: '#bbb6ba' },
    photos: auraniaPhotos,
    brochure: { href: '/Villa%20Aurania.pdf', filename: 'Villa Aurania.pdf', cover: '/brochures/aurania-cover.webp', pages: 16 },
    stayPrice: 12000,
    refundableDeposit: 3000,
    priceIncludes: 'The price includes the stay and amenities only.',
    amenities: [
      { name: 'Jacuzzi', detail: 'Settle in for a little time to unwind.' },
      { name: 'Rain dance', detail: 'A little music. A little dancing in the rain.' },
      { name: 'Music & karaoke', detail: 'Bluetooth speaker with a wireless microphone.' },
      { name: 'Games & good company', detail: 'Badminton, playing cards, carrom, lagori and more.' },
      { name: 'Air conditioning', detail: 'AC in all bedrooms.' },
      { name: 'Water cooler', detail: 'Available in the hall.' },
      { name: 'Microwave', detail: 'For a quick warm-up whenever you need it.' },
      { name: 'Refrigerator', detail: 'Keep your refreshments chilled.' },
      { name: 'Power backup', detail: 'A little extra peace of mind.' },
      { name: 'Cutlery', detail: 'The everyday dining essentials.' },
      { name: 'Towels', detail: 'One less thing on your packing list.' },
      { name: 'Toiletries', detail: 'The essentials for your stay.' },
    ],
    food: villaDining,
    host: { name: 'Hardik Panchal', role: 'Founder' },
  },
  {
    slug: 'villa-archway',
    name: 'Villa Archway',
    style: 'Balinese villa',
    bedrooms: 3,
    hasPool: true,
    location: 'Virar East',
    introduction: 'Good company. A slower kind of day.',
    description: 'Three bedrooms, a private pool and room for up to 20 guests. Arched windows, green views and a rooftop under the stars.',
    heroImage: { src: '/archway/optimized/archway-54-1920.webp', alt: 'Villa Archway’s sunlit arched facade and balconies beside a tall palm', width: 1920, height: 1288, position: 'center top', mobilePosition: '48% top', responsive: true, foregroundMask: '/images/archway-hero-mask.svg', sky: '#509bd0' },
    photos: archwayPhotos,
    brochure: { href: '/Archway.pdf', filename: 'Archway.pdf', cover: '/brochures/archway-cover.webp', pages: 20 },
    food: villaDining,
    amenities: [
      { name: 'Private swimming pool', detail: 'Your own little escape by the water.' },
      { name: 'Three bedrooms', detail: 'Warm interiors and a quiet place to settle in.' },
      { name: 'Four bathrooms', detail: 'A little more ease for everyone.' },
      { name: 'Up to 20 guests', detail: 'An exclusive villa stay for your group.' },
      { name: 'Indoor games', detail: 'Pool, foosball, table tennis, board games and darts.' },
      { name: 'Wi-Fi access', detail: 'Stay connected throughout your stay.' },
    ],
    host: { name: 'Hardik Panchal', role: 'Founder' },
  },
];

export function getVilla(slug: string) {
  return villas.find(villa => villa.slug === slug);
}

export function formatRupees(value: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
}
