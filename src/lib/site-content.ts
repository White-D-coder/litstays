import { villas } from './villas';

export type PropertyFact = { label: string; value: string; detail: string };
export type Photo = { id: string; src: string; alt: string; caption: string; category: string };

export const site = {
  name: 'The LIT Stays',
  url: 'https://the-lit-stays-retreat.keyursatra.chatgpt.site',
  instagram: 'https://www.instagram.com/the_lit_stays/',
  instagramMessage: 'https://ig.me/m/the_lit_stays',
  listing: 'https://www.airbnb.co.uk/rooms/1728587845573584919',
  property: 'Villa Archway',
  location: 'Virar East, Maharashtra',
  directions: 'https://www.google.com/maps/search/?api=1&query=Virar+East+Maharashtra+India',
  // Add only owner-confirmed values. Undefined details are never rendered.
  contact: { whatsapp: undefined as string | undefined, email: undefined as string | undefined },
  propertyDetails: {
    guestCapacity: 20,
    bedrooms: 3,
    bathrooms: 4,
    checkInTime: '1:00 PM',
    checkOutTime: '11:00 AM',
  },
  unconfirmed: {
    streetAddress: undefined as string | undefined,
    nightlyRate: undefined as number | undefined,
  },
  facts: [
    { label: 'Yours, entirely', value: '01', detail: 'Private villa' },
    { label: 'Room to unwind', value: '03', detail: 'Bedrooms' },
    { label: 'A little more ease', value: '04', detail: 'Bathrooms' },
    { label: 'Take a moment', value: 'Pool', detail: 'A private dip' },
  ] satisfies PropertyFact[],
  source: {
    url: 'https://www.airbnb.co.uk/rooms/1728587845573584919',
    checked: '2026-10-28',
    note: 'Architecture, bedrooms, bathrooms and imagery: host-published Villa Archway listing. Capacity, check-in, check-out and FAQ policies: owner-supplied screenshots in this conversation.',
  },
} as const;

export const navigation = [
  { label: 'The bungalow', href: '#bungalow' },
  { label: 'The experience', href: '#experience' },
  ...villas.map(villa => ({ label: villa.name, href: `/villas/${villa.slug}/` })),
  { label: 'Our Story', href: '/our-story/' },
] as const;

export const photos: Photo[] = [
  { id: 'living', src: '/lifestyle/approved/lounge-guests.webp', alt: 'Guests relaxing together in a villa lounge', caption: 'Room for good company', category: 'The living spaces' },
  { id: 'bedroom', src: '/lifestyle/approved/bedroom-guest.webp', alt: 'A guest enjoying a quiet moment in a villa bedroom', caption: 'Nowhere to rush to', category: 'The bedrooms' },
  { id: 'pool', src: '/lifestyle/approved/poolside-guests.webp', alt: 'Guests enjoying a villa swimming pool together', caption: 'Take the afternoon off', category: 'The outdoors' },
  { id: 'exterior', src: '/lifestyle/approved/arrival-guest.webp', alt: 'A guest arriving at the villa', caption: 'A warm arrival', category: 'The architecture' },
  { id: 'dining', src: '/lifestyle/approved/dining-guests.webp', alt: 'Guests sharing a meal at the villa', caption: 'Stay for one more conversation', category: 'The dining space' },
  { id: 'balcony', src: '/lifestyle/approved/balcony-couple.webp', alt: 'A couple enjoying a quiet moment on a villa balcony', caption: 'Your morning, unhurried', category: 'The little corners' },
  { id: 'terrace', src: '/lifestyle/approved/terrace-couple.webp', alt: 'A couple spending the evening on a villa terrace', caption: 'Let the evening linger', category: 'The terrace' },
  { id: 'games', src: '/lifestyle/approved/games-guests.webp', alt: 'Guests enjoying indoor games together', caption: 'A little friendly competition', category: 'Time together' },
  { id: 'arrival', src: '/lifestyle/approved/arrival-guest.webp', alt: 'A guest walking through the villa entrance', caption: 'Leave the everyday at the door', category: 'The arrival' },
];

export const moments = [
  { number: '01', title: 'Mornings, without an alarm.', description: 'An easy start. A favourite cup. A quiet corner with a view. Let the day find its own rhythm.', image: 'balcony', alt: photos[5].alt },
  { number: '02', title: 'Together, a little longer.', description: 'Gather around the table, settle into a game, or let a good conversation take the whole afternoon.', image: 'dining', alt: photos[4].alt },
  { number: '03', title: 'Evenings worth staying in for.', description: 'As the lights come on and the day softens, there’s no next stop. Just your people, and time to enjoy them.', image: 'terrace', alt: photos[6].alt },
];
