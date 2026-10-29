import { router } from 'expo-router';
import { listGarments } from '@/api/garments';
import { useFocusFetch } from '@/hooks/useFocusFetch';
import type { Garment } from '@/types';
import { useGarmentFilters } from './useGarmentFilters';

// Declarada fuera del hook para que su identidad sea estable (ver useFocusFetch).
const fetchGarments = () => listGarments().then((response) => response.garments);

export function useGarmentList() {
  const { data: garments, isLoading, isRefreshing, error, onRefresh } = useFocusFetch<Garment[]>(fetchGarments, []);
  const filters = useGarmentFilters(garments);

  const openNewGarment = () => router.push('/garment/new');
  // Los parámetros de ruta solo aceptan texto: se mandan los campos uno por uno
  // (no { ...garment }, porque isFavorite es booleano) y '' cuando no hay foto.
  // useEditGarment los lee con estos mismos nombres (contrato de la Fase 0).
  const openGarment = (garment: Garment) =>
    router.push({
      pathname: '/garment/[id]',
      params: {
        id: garment.id,
        name: garment.name,
        category: garment.category,
        color: garment.color,
        swatchColor: garment.swatchColor,
        imageUrl: garment.imageUrl ?? '',
        imagePublicId: garment.imagePublicId ?? '',
      },
    });

  return { garments, isLoading, isRefreshing, error, onRefresh, ...filters, openNewGarment, openGarment };
}