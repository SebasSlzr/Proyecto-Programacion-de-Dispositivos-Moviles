import { useMemo, useState } from 'react';
import { router, type Href } from 'expo-router';
import { listWishlist } from '@/api/wishlist';
import { useFocusFetch } from '@/hooks/useFocusFetch';
import type { WishlistItem } from '@/types';

export type WishlistFilter = 'pending' | 'purchased' | 'all';

// Declarada fuera del hook para que sea estable: si se creara en cada render,
// useFocusFetch recargaría la lista en bucle.
const fetchWishlist = () => listWishlist().then((response) => response.items);

// Las rutas /wishlist/... las crea Sebas en la Fase 0. Mientras no existan,
// el tipado de rutas no las conoce; el "as string as Href" se quita cuando estén.
const NEW_WISH_ROUTE = '/wishlist/new' as string as Href;
const wishRoute = (id: string) => `/wishlist/${id}` as string as Href;

// Lista de deseos: carga al volver a la pantalla, filtra por estado de compra
// y busca por nombre o tienda. Todo el filtrado es local, no se vuelve a pedir al servidor.
export function useWishlistList() {
  const { data: items, isLoading, isRefreshing, error, onRefresh } = useFocusFetch<WishlistItem[]>(fetchWishlist, []);
  const [filter, setFilter] = useState<WishlistFilter>('pending');
  const [search, setSearch] = useState('');

  const pendingCount = useMemo(() => items.filter((item) => !item.purchased).length, [items]);

  const filteredItems = useMemo(() => {
    const text = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchesFilter =
        filter === 'all' || (filter === 'purchased' ? item.purchased : !item.purchased);
      const matchesSearch =
        !text || item.name.toLowerCase().includes(text) || (item.store ?? '').toLowerCase().includes(text);
      return matchesFilter && matchesSearch;
    });
  }, [items, filter, search]);

  const openNewWish = () => router.push(NEW_WISH_ROUTE);

  // El detalle recibe solo el id y carga el deseo por su cuenta,
  // así también funciona cuando se abre desde la notificación.
  const openWish = (item: WishlistItem) => router.push(wishRoute(item.id));

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
