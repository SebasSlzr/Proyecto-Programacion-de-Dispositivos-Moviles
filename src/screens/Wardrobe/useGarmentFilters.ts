import { useMemo, useState } from 'react';
import { COLOR_FAMILIES } from '@/constants/colors';
import { getColorFamily, type ColorFamily } from '@/utils/color';
import type { Garment } from '@/types';

// Búsqueda por texto, filtro por categoría y filtro por familia de color,
// 100% locales: la lista ya está completa en memoria, no se vuelve a pedir
// al servidor. Los tres filtros se combinan (una prenda debe cumplirlos todos).
export function useGarmentFilters(garments: Garment[]) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [colorFilter, setColorFilter] = useState<ColorFamily | null>(null);

  const toggleCategory = (category: string) =>
    setCategoryFilter((current) => (current === category ? null : category));
  const clearCategory = () => setCategoryFilter(null);

  // Tocar la familia ya seleccionada la quita (igual que con las categorías).
  const toggleColor = (family: ColorFamily) =>
    setColorFilter((current) => (current === family ? null : family));
  const clearColor = () => setColorFilter(null);

  // La familia de cada prenda sale de su color de muestra (el detectado por el
  // servidor o el que corrigió la usuaria). Se calcula una vez por prenda.
  const familyById = useMemo(
    () => new Map(garments.map((garment) => [garment.id, getColorFamily(garment.swatchColor)])),
    [garments]
  );

  // Solo se ofrecen las familias que existen en el armario, en el orden de COLOR_FAMILIES.
  const availableColors = useMemo(() => {
    const present = new Set(familyById.values());
    return COLOR_FAMILIES.filter((family) => present.has(family.key)).map((family) => family.key);
  }, [familyById]);

  const filteredGarments = useMemo(() => {
    const text = search.toLowerCase();
    return garments.filter((garment) => {
      const matchesSearch = garment.name.toLowerCase().includes(text);
      const matchesCategory = !categoryFilter || garment.category === categoryFilter;
      const matchesColor = !colorFilter || familyById.get(garment.id) === colorFilter;
      return matchesSearch && matchesCategory && matchesColor;
    });
  }, [garments, search, categoryFilter, colorFilter, familyById]);

  return {
    search,
    setSearch,
    categoryFilter,
    toggleCategory,
    clearCategory,
    colorFilter,
    toggleColor,
    clearColor,
    availableColors,
    filteredGarments,
  };
}
