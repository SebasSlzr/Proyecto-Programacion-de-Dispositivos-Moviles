import type { WishlistItem } from '@/types';

export type WishlistFilter = 'pending' | 'purchased' | 'all';

// Funciones puras de la wishlist: no tocan red, estado ni pantallas, por eso se prueban con Jest.

// Convierte lo que se escribe en el campo de precio a número.
// "189.900", "189 900", "189,900" o "189900" -> 189900. Vacío -> null.
// Los pesos no llevan centavos, así que se quitan puntos, comas y espacios.
// Devuelve undefined si no es un número válido, para que el formulario muestre el error.
export function parsePrice(text: string): number | null | undefined {
  const clean = text.replace(/[\s.,]/g, '');
  if (!clean) return null;
  if (!/^\d+$/.test(clean)) return undefined;
  return Number(clean);
}

// true si el texto es un link http(s). Es la misma regla que valida el servidor.
export function isHttpLink(text: string): boolean {
  return /^https?:\/\/\S+$/i.test(text.trim());
}

// Pasa a minúsculas y quita las tildes, para que buscar "cafe" encuentre "Café".
export function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

// Filtra los deseos por estado de compra y por búsqueda en el nombre o la tienda.
export function filterWishlist(items: WishlistItem[], filter: WishlistFilter, search: string): WishlistItem[] {
  const text = normalizeText(search);
  return items.filter((item) => {
    const matchesFilter = filter === 'all' || (filter === 'purchased' ? item.purchased : !item.purchased);
    const matchesSearch =
      !text || normalizeText(item.name).includes(text) || normalizeText(item.store ?? '').includes(text);
    return matchesFilter && matchesSearch;
  });
}

// Cuántos deseos faltan por comprar (el subtítulo de la lista).
export function countPending(items: WishlistItem[]): number {
  return items.filter((item) => !item.purchased).length;
}
