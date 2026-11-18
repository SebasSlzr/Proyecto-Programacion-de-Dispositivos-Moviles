import type { Garment } from '@/types';

export type Harmony = 'complementario' | 'analogo' | 'neutro';

export type OutfitSuggestion = {
    head: string | null;
    torso: string[];
    legs: string | null;
    feet: string | null;
    harmony: Harmony;
    anchorId: string;
};

export const OUTFITS_MINIMOS_PARA_COMPRAR = 3;

export function sugerirOutfit(
    prendas: Garment[],
    opciones?: {
        random?: ()=> number;
        excluir?: string[];
        ancla?: Garment;
    }, 
): OutfitSuggestion | null {
    return null;
} 

export function outfitsConPrenda(prenda: Garment, armario: Garment[], max = 5): OutfitSuggestion[] {
  return [];
}





