import { useMemo, useState } from 'react';
import { router } from 'expo-router';
import { listWishlist } from '@/api/wishlist';
import { useFocusFetch } from '@/hooks/useFocusFetch';
import type { WishlistItem } from '@/types';
import { countPending, filterWishlist, type WishlistFilter } from '@/utils/wishlist';

export type { WishlistFilter };

// Declarada fuera del hook para que sea estable: si se creara en cada render,
// useFocusFetch recargaría la lista en bucle.
const fetchWishlist = () => listWishlist().then((response) => response.items);

// Lista de deseos: carga al volver a la pantalla, filtra por estado de compra
// y busca por nombre o tienda. Todo el filtrado es local, no se vuelve a pedir al servidor.
export function useWishlistList() {
  const { data: items, isLoading, isRefreshing, error, onRefresh } = useFocusFetch<WishlistItem[]>(fetchWishlist, []);
  const [filter, setFilter] = useState<WishlistFilter>('pending');
  const [search, setSearch] = useState('');

  const pendingCount = useMemo(() => countPending(items), [items]);

  const filteredItems = useMemo(() => filterWishlist(items, filter, search), [items, filter, search]);

  const openNewWish = () => router.push('/wishlist/new');

  // El detalle recibe solo el id y carga el deseo por su cuenta,
  // así también funciona cuando se abre desde la notificación.
  const openWish = (item: WishlistItem) => router.push({ pathname: '/wishlist/[id]', params: { id: item.id } });

  return {
    items,
    filteredItems,
    pendingCount,
    filter,
    setFilter,
    search,
    setSearch,
    isLoading,
    isRefreshing,
    error,
    onRefresh,
    openNewWish,
    openWish,
  };
}
