import { useMemo } from 'react';
import type { Garment, Outfit } from '@/types';

// Devuelve las prendas del outfit "de arriba a abajo": cabeza, cada capa de torso,
// piernas y pies. Los espacios vacíos (null) se omiten.
export function useOutfitLayers(outfit: Outfit): Garment[] {
  return useMemo(
    () =>
      [outfit.head, ...outfit.torso, outfit.legs, outfit.feet].filter(
        (garment): garment is Garment => garment !== null
      ),
    [outfit]
  );
}