export type FAQBlock = { type: 'paragraph'; text: string } | { type: 'list'; items: string[] };
export type FAQItem = { question: string; answer: FAQBlock[] };

// Transcribed from the property information screenshots supplied by the owner.
export const faqs: FAQItem[] = [
  {
    question: 'What are the check-in & check-out timings?',
    answer: [{ type: 'paragraph', text: 'Check-in is from 1:00 PM onwards, and check-out is by 11:00 AM. Early check-in or late check-out may be accommodated subject to availability and additional charges.' }],
  },
  {
    question: 'How many guests are allowed?',
    answer: [
      { type: 'paragraph', text: 'The guest capacity depends on the villa booked:' },
      { type: 'list', items: ['Villa Archway (3BHK): Up to 20 guests', 'Villa Avante (2BHK): Up to 15 guests', 'Villa Aurania (2BHK): Up to 15 guests'] },
    ],
  },
  {
    question: 'Are meals included?',
    answer: [
      { type: 'paragraph', text: 'Yes, we offer optional meal packages that include Lunch, Evening Snacks, Dinner, and Breakfast.' },
      { type: 'paragraph', text: 'Our meal package options are:' },
      { type: 'list', items: ['₹1,400 per person – Veg Classic', '₹1,650 per person – Veg Premium', '₹1,600 per person – Non-Veg Classic', '₹1,900 per person – Non-Veg Premium'] },
      { type: 'paragraph', text: 'All meals are freshly prepared and served at the villa. Meal preferences and the final guest count must be confirmed at least 4 days prior to check-in to ensure the best service. Please also inform us of any dietary preferences or allergies in advance.' },
    ],
  },
  {
    question: 'Are pets allowed?',
    answer: [{ type: 'paragraph', text: 'Yes, pets are welcome at The LIT Stays. Guests are requested to clean up after their pets and ensure they don’t soil the property. Any damage or excessive cleaning may incur additional charges.' }],
  },
  {
    question: 'Do the villas have a private pool?',
    answer: [
      { type: 'paragraph', text: 'Our amenities vary by villa:' },
      { type: 'list', items: ['Villa Archway – Private Swimming Pool.', 'Villa Avante – Private Swimming Pool.', 'Villa Aurania – Private Jacuzzi & Rain Dance Area (No Swimming Pool).'] },
    ],
  },
  {
    question: 'Is Wi-Fi available?',
    answer: [{ type: 'paragraph', text: 'Yes, complimentary high-speed Wi-Fi is available throughout the property.' }],
  },
  {
    question: 'Is parking available?',
    answer: [{ type: 'paragraph', text: 'Yes, complimentary parking is available. Each villa is provided with dedicated parking space outside the property, allowing guests to park their vehicles conveniently during their stay.' }],
  },
  {
    question: 'Can I celebrate birthdays or special occasions?',
    answer: [
      { type: 'paragraph', text: 'Absolutely! The LIT Stays is a perfect venue for birthdays, anniversaries, family gatherings, and other special occasions.' },
      { type: 'paragraph', text: 'For decorations, only our approved decoration vendor is permitted. Outside decorators are not allowed. To maintain the condition of the villa, sticking tapes, adhesives, nails, or any other materials on walls, windows, curtains, or furniture is strictly prohibited. Any damage caused may result in additional charges.' },
    ],
  },
];
