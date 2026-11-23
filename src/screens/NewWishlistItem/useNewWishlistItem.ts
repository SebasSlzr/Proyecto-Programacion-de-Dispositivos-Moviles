import { router } from 'expo-router';
import { createWishlistItem, type WishlistInput } from '@/api/wishlist';

// Crea el deseo y cierra el modal. Al volver, la lista se recarga sola (useFocusFetch).
export function useNewWishlistItem() {
  const saveWish = async (values: Partial<WishlistInput>) => {
    await createWishlistItem(values as WishlistInput);
    router.back();
  };

  return { saveWish };
}
