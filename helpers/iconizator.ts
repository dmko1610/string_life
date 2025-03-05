import { ImageSource } from 'expo-image';

import images from './images';

const typesToIcons: Record<string, ImageSource> = {
  electro: images.electroGuitarLarge,
  acoustic: images.acousticGuitarLarge,
  bass: images.bassGuitarLarge,
  ukulele: images.ukuleleLarge,
};

export function typeToIcon(type: keyof typeof typesToIcons): ImageSource {
  return typesToIcons[type];
}
