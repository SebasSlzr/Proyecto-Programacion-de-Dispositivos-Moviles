import { useMemo, useState } from 'react';
import type { Garment } from '@/types';

// Búsqueda por texto y filtro por categoría, 100% locales: la lista ya
// está completa en memoria, no se vuelve a pedir al servidor.
export function useGarmentFilters(garments: Garment[]) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const toggleCategory = (category: string) =>
    setCategoryFilter((current) => (current === category ? null : category));

  const clearCategory = () => setCategoryFilter(null);

  const filteredGarments = useMemo(() => {
    return garments.filter((garment) => {
      const matchesSearch = garment.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !categoryFilter || garment.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [garments, search, categoryFilter]);

  return { search, setSearch, categoryFilter, toggleCategory, clearCategory, filteredGarments };
}