import { useCallback, useMemo, useState } from 'react';
import { router } from 'expo-router';
import { useFocusEffect } from 'expo-router/react-navigation';
import { listOutfits } from '@/api/outfits';
import type { Outfit } from '@/types';

// Carga los outfits cada vez que la pantalla gana foco, y aplica la búsqueda por nombre.
export function useOutfitList() {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const loadOutfits = useCallback(async () => {
    try {
      const data = await listOutfits();
      setOutfits(data.outfits);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      loadOutfits().finally(() => setIsLoading(false));
    }, [loadOutfits])
  );

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadOutfits();
    setIsRefreshing(false);
  };

  const filteredOutfits = useMemo(
    () => outfits.filter((outfit) => outfit.name.toLowerCase().includes(search.toLowerCase())),
    [outfits, search]
  );

  // Las rutas solo aceptan strings, así que se mandan los ids de las prendas.
  const openOutfit = (outfit: Outfit) => {
    router.push({
      pathname: '/outfit/[id]',
      params: {
        id: outfit.id,
        name: outfit.name,
        head: outfit.head?.id ?? '',
        legs: outfit.legs?.id ?? '',
        feet: outfit.feet?.id ?? '',
        torso: JSON.stringify(outfit.torso.map((g) => g.id)),
      },
    });
  };

  return { outfits, filteredOutfits, isLoading, isRefreshing, error, search, setSearch, onRefresh, openOutfit };
}
