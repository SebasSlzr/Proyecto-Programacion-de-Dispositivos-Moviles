export const OUTFIT_SLOTS = [
  { key: 'head', label: 'Cabeza', multiple: false, categories: ['Accesorio'] },
  { key: 'torso', label: 'Torso', multiple: true, categories: ['Camiseta', 'Chaqueta', 'Vestido', 'Accesorio'] },
  { key: 'legs', label: 'Piernas', multiple: false, categories: ['Pantalón', 'Vestido'] },
  { key: 'feet', label: 'Pies', multiple: false, categories: ['Zapatos'] },
] as const;

export type OutfitSlotKey = (typeof OUTFIT_SLOTS)[number]['key'];