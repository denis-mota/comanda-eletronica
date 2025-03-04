// Placeholder image URLs for menu items
export const placeholderImages = {
  pilsen: 'https://placehold.co/300x200?text=Pilsen',
  imperialStout: 'https://placehold.co/300x200?text=Imperial+Stout',
  regua: 'https://placehold.co/300x200?text=Regua',
  hotDog: 'https://placehold.co/300x200?text=Hot+Dog',
  carneLouca: 'https://placehold.co/300x200?text=Carne+Louca',
  fileMignon: 'https://placehold.co/300x200?text=File+Mignon',
  salmao: 'https://placehold.co/300x200?text=Salmao+Grelhado',
  risoto: 'https://placehold.co/300x200?text=Risoto+Funghi'
};

// Function to get image URL with fallback
export const getImageUrl = (key) => {
  return placeholderImages[key] || 'https://placehold.co/300x200?text=No+Image';
};