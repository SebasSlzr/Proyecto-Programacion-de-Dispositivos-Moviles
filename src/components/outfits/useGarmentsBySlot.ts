import { useMemo } from 'react';
import { OUTFIT_SLOTS, type OutfitSlotKey } from '@/constants/outfits';
import type { Garment } from '@/types';

export type GarmentsBySlot = Record<OutfitSlotKey, Garment[]>;

// Agrupa las prendas del armario según el espacio del outfit donde se pueden usar
// (por categoría). Solo se recalcula cuando cambia el armario, no en cada render.
export function useGarmentsBySlot(wardrobe: Garment[]): GarmentsBySlot {
  return useMemo(() => {
    const groups: GarmentsBySlot = { head: [], torso: [], legs: [], feet: [] };
    for (const slot of OUTFIT_SLOTS) {
      const categories = slot.categories as readonly string[];
      groups[slot.key] = wardrobe.filter((garment) => categories.includes(garment.category));
    }
    return groups;
  }, [wardrobe]);
}