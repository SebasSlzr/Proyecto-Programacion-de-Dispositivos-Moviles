import { useCallback, useMemo, useState } from 'react';
import { useFocusEffect } from 'expo-router/react-navigation';
import { listGarments } from '@/api/garments';
import type { Garment } from '@/types';

// Carga las prendas cada vez que la pantalla gana foco, y aplica búsqueda y filtro por categoría.
export function useGarmentList() {
  const [garments, setGarments] = useState<Garment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const loadGarments = useCallback(async () => {
    try {
      const data = await listGarments();
      setGarments(data.garments);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      loadGarments().finally(() => setIsLoading(false));
    }, [loadGarments])
  );

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadGarments();
    setIsRefreshing(false);
  };

  const toggleCategory = (category: string | null) => {
    setCategoryFilter(category === null || categoryFilter === category ? null : category);
  };

  const filteredGarments = useMemo(() => {
    return garments.filter((garment) => {
      const matchesSearch = garment.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !categoryFilter || garment.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [garments, search, categoryFilter]);

  return {
    garments,
    filteredGarments,
    isLoading,
    isRefreshing,
    error,
    search,
    setSearch,
    categoryFilter,
    toggleCategory,
    onRefresh,
  };
}
