export type PropertyFact = { label: string; value: string; detail: string };
export type Photo = { id: string; alt: string; caption: string; category: string };

export const site = {
  name: 'The Lit Stays',
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
  { label: 'The gallery', href: '#gallery' },
] as const;

export const photos: Photo[] = [
  { id: 'living', alt: 'Sunlit living room with curved windows, neutral sofas and a low timber table at Villa Archway', caption: 'Room for good company', category: 'The living spaces' },
  { id: 'bedroom', alt: 'Warm bedroom opening onto a green view through a large arched window', caption: 'Nowhere to rush to', category: 'The bedrooms' },
  { id: 'pool', alt: 'Blue private swimming pool beside warm stone walls and greenery', caption: 'Take the afternoon off', category: 'The outdoors' },
  { id: 'exterior', alt: 'Villa Archway’s illuminated facade with arches and balconies at dusk', caption: 'A warm arrival', category: 'The architecture' },
  { id: 'dining', alt: 'Round dining table set in front of an arched window with views of trees', caption: 'Stay for one more conversation', category: 'The dining space' },
  { id: 'balcony', alt: 'Two woven chairs and a small round table on a balcony surrounded by trees', caption: 'Your morning, unhurried', category: 'The little corners' },
  { id: 'terrace', alt: 'Open rooftop terrace with warm wall lights beneath the evening sky', caption: 'Let the evening linger', category: 'The terrace' },
  { id: 'games', alt: 'Pool table and indoor games in a bright room with a woodland view', caption: 'A little friendly competition', category: 'Time together' },
  { id: 'arrival', alt: 'Villa Archway’s entrance passage with arched windows and potted plants', caption: 'Leave the everyday at the door', category: 'The arrival' },
];

export const moments = [
  { number: '01', title: 'Mornings, without an alarm.', description: 'An easy start. A favourite cup. A quiet corner with a view. Let the day find its own rhythm.', image: 'balcony', alt: photos[5].alt },
  { number: '02', title: 'Together, a little longer.', description: 'Gather around the table, settle into a game, or let a good conversation take the whole afternoon.', image: 'dining', alt: photos[4].alt },
  { number: '03', title: 'Evenings worth staying in for.', description: 'As the lights come on and the day softens, there’s no next stop. Just your people, and time to enjoy them.', image: 'terrace', alt: photos[6].alt },
];
