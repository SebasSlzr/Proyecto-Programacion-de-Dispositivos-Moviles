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
  const openGarment = (garment: Garment) =>
    router.push({ pathname: '/garment/[id]', params: { ...garment } });

  return { garments, isLoading, isRefreshing, error, onRefresh, ...filters, openNewGarment, openGarment };
}