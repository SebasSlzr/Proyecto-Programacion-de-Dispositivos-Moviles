import { useMemo, useState } from 'react';
import { router } from 'expo-router';
import { listOutfits } from '@/api/outfits';
import { useFocusFetch } from '@/hooks/useFocusFetch';
import type { Outfit } from '@/types';

const fetchOutfits = () => listOutfits().then((response) => response.outfits);

export function useOutfitList() {
  const { data: outfits, isLoading, isRefreshing, error, onRefresh } = useFocusFetch<Outfit[]>(fetchOutfits, []);
  const [search, setSearch] = useState('');

  const filteredOutfits = useMemo(
    () => outfits.filter((outfit) => outfit.name.toLowerCase().includes(search.toLowerCase())),
    [outfits, search]
  );

  const openNewOutfit = () => router.push('/outfit/new');

  // Abre el creador pidiéndole una sugerencia (contrato 6.5): los parámetros de
  // ruta solo aceptan texto, por eso es '1' y no true. El creador (de Castri)
  // lee `suggest` y arma la combinación con sugerirOutfit al abrir.
  const openSuggestedOutfit = () => router.push({ pathname: '/outfit/new', params: { suggest: '1' } });

  // Los parámetros de ruta solo pueden ser texto: el torso (varias prendas)
  // viaja como JSON y la pantalla de edición lo vuelve a convertir.
  const openOutfit = (outfit: Outfit) =>
    router.push({
      pathname: '/outfit/[id]',
      params: {
        id: outfit.id,
        name: outfit.name,
        head: outfit.head?.id ?? '',
        legs: outfit.legs?.id ?? '',
        feet: outfit.feet?.id ?? '',
        torso: JSON.stringify(outfit.torso.map((garment) => garment.id)),
      },
    });

  return {
    outfits,
    filteredOutfits,
    search,
    setSearch,
    isLoading,
    isRefreshing,
    error,
    onRefresh,
    openNewOutfit,
    openSuggestedOutfit,
    openOutfit,
  };
}