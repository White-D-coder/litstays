export const mealPackages = [
  { name: 'Veg Classic', price: 1400 },
  { name: 'Veg Premium', price: 1650 },
  { name: 'Non-Veg Classic', price: 1600 },
  { name: 'Non-Veg Premium', price: 1900 },
] as const;

// Owner-supplied TLS - Food Package.pdf, pages 3–8.
export const villaDining = {
  minPrice: 1400,
  maxPrice: 1900,
  meals: ['Lunch', 'High tea', 'Dinner', 'Breakfast'],
  description: 'Four meals, beautifully served. Optional in-house dining for your stay.',
};
export const foodBrochure = {
  title: 'Food packages brochure',
  href: '/TLS%20-%20Food%20Package.pdf',
  filename: 'TLS - Food Package.pdf',
};
