import { router, useLocalSearchParams } from 'expo-router';
import { createOutfit, type OutfitInput } from '@/api/outfits';
import { useWardrobe } from '@/hooks/useWardrobe';
import type { Garment } from '@/types';

// Parámetros de /outfit/new (contrato 6.5). Todos son texto; '' significa "no tiene".
type NewOutfitParams = {
  suggest?: string; // '1' = aplicar una sugerencia al abrir (botón de la lista de outfits)
  name?: string;
  head?: string;
  torso?: string;   // arreglo de ids en JSON: '["id1","id2"]'
  legs?: string;
  feet?: string;
};

// torso llega como texto JSON porque los parámetros de ruta no aceptan arreglos.
function parseTorso(texto: string | undefined): string[] {
  if (!texto) return [];
  try {
    const valor: unknown = JSON.parse(texto);
    return Array.isArray(valor) ? valor.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

// Outfit precargado desde la ruta (lo usa la notificación "Tu outfit de hoy").
// Se descartan los ids que ya no están en el armario, por si una prenda se eliminó.
function buildPrefill(params: NewOutfitParams, wardrobe: Garment[]): OutfitInput | undefined {
  const enArmario = (id: string | undefined) => (id && wardrobe.some((g) => g.id === id) ? id : null);
  const head = enArmario(params.head);
  const legs = enArmario(params.legs);
  const feet = enArmario(params.feet);
  const torso = parseTorso(params.torso).filter((id) => enArmario(id) !== null);
  if (!head && !legs && !feet && torso.length === 0) return undefined;
  return { name: params.name ?? '', head, torso, legs, feet };
}

// Carga el armario para elegir prendas, lee los parámetros de la ruta, crea el outfit y cierra el modal.
export function useNewOutfit() {
  const params = useLocalSearchParams<NewOutfitParams>();
  const { wardrobe, isLoading } = useWardrobe();

  const autoSuggest = params.suggest === '1';
  const prefill = isLoading ? undefined : buildPrefill(params, wardrobe);

  const saveOutfit = async (values: Partial<OutfitInput>) => {
    await createOutfit(values as OutfitInput);
    router.back();
  };

  return { wardrobe, isLoading, prefill, autoSuggest, saveOutfit };
}
