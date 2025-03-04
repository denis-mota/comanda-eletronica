// Import local images
import feijoada from '../assets/feijoada.webp';
import muqueca from '../assets/muqueca.webp';
import churrasco from '../assets/churrasco.webp';
import bacalhau from '../assets/bacalhau.webp';
import lasanha from '../assets/lasanha.webp'

// Placeholder image URLs for menu items
export const placeholderImages = {
  feijoada: feijoada,
  muqueca: muqueca,
  churrasco: churrasco,
  bacalhau: bacalhau,
  lasanha: lasanha,
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