import type { Garment, WishlistItem, WishlistPreview } from '@/types';
import { request } from './client';

export type WishlistInput = {
  name: string;
  url?: string | null;
  store?: string | null;
  price?: number | null;
  category?: string | null;
  imageUrl?: string | null;
  imagePublicId?: string | null;
};

export function listWishlist() {
  return request<{ items: WishlistItem[] }>('/wishlist');
}

export function getWishlistItem(id: string) {
  return request<{ item: WishlistItem }>(`/wishlist/${id}`);
}

export function createWishlistItem(input: WishlistInput) {
  return request<{ item: WishlistItem }>('/wishlist', { body: input });
}

export function updateWishlistItem(id: string, changes: Partial<WishlistInput>) {
  return request<{ item: WishlistItem }>(`/wishlist/${id}`, { method: 'PUT', body: changes });
}

export function deleteWishlistItem(id: string) {
  return request<{ message: string }>(`/wishlist/${id}`, { method: 'DELETE' });
}

export function setWishlistPurchased(id: string, purchased: boolean) {
  return request<{ item: WishlistItem }>(`/wishlist/${id}/purchased`, { method: 'PATCH', body: { purchased } });
}

// Crea una prenda con la foto del deseo y elimina el deseo. 400 si no tiene foto.
export function moveWishlistToWardrobe(id: string, input: { category: string }) {
  return request<{ garment: Garment }>(`/wishlist/${id}/move-to-wardrobe`, { method: 'POST', body: input });
}

// El servidor lee el link (tienda o publicación) y sube la imagen a Cloudinary.
// 400 si el link es inválido; 422 si no se pudo leer la página.
export function previewWishlistLink(url: string) {
  return request<{ preview: WishlistPreview }>('/wishlist/preview', { method: 'POST', body: { url } });
}