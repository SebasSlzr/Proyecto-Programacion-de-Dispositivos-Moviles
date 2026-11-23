import { useWardrobe } from '@/hooks/useWardrobe';
import {
  deseoComoPrenda,
  outfitsConPrenda,
  veredictoDeCompra,
  type OutfitSuggestion,
  type VeredictoCompra,
} from '@/utils/suggestOutfit';
import type { Garment, WishlistItem } from '@/types';

export type WishMatchesStatus = 'loading' | 'missing-data' | 'empty-wardrobe' | 'ready';

// Regla de los 3 outfits: carga el armario, convierte el deseo en una prenda
// (categoría + color detectado) y cuenta con cuántos outfits distintos combina.
// Devuelve solo lo que el componente necesita para dibujar.
export function useWishOutfitMatches(item: WishlistItem) {
  const { wardrobe, isLoading } = useWardrobe();
  const wishGarment = deseoComoPrenda(item);

  let status: WishMatchesStatus = 'ready';
  if (isLoading) status = 'loading';
  else if (!wishGarment) status = 'missing-data';
  else if (wardrobe.length === 0) status = 'empty-wardrobe';

  const matches: OutfitSuggestion[] =
    status === 'ready' && wishGarment ? outfitsConPrenda(wishGarment, wardrobe) : [];
  const verdict: VeredictoCompra = veredictoDeCompra(matches.length);

  // Para dibujar las miniaturas: de un id a su prenda (el armario y el deseo).
  const garmentsById = new Map<string, Garment>(wardrobe.map((g) => [g.id, g]));
  if (wishGarment) garmentsById.set(wishGarment.id, wishGarment);

  // Las prendas de un outfit de arriba a abajo: cabeza, capas del torso, piernas y pies.
  const layersOf = (outfit: OutfitSuggestion): Garment[] =>
    [outfit.head, ...outfit.torso, outfit.legs, outfit.feet]
      .map((id) => (id ? garmentsById.get(id) : undefined))
      .filter((g): g is Garment => g !== undefined);

  return { status, matches, verdict, layersOf, wishGarmentId: wishGarment?.id ?? null };
}
