import { describe, expect, test } from '@jest/globals';
import { formatPrice } from '@/components/wishlist/formatPrice';
import type { WishlistItem } from '@/types';
import { countPending, filterWishlist, isHttpLink, normalizeText, parsePrice } from '@/utils/wishlist';

// Crea un deseo de prueba con solo los datos que importan en cada caso.
function wish(overrides: Partial<WishlistItem>): WishlistItem {
  return {
    id: overrides.name ?? 'x',
    name: 'Prenda',
    url: null,
    store: null,
    price: null,
    category: null,
    imageUrl: null,
    imagePublicId: null,
    dominantColor: null,
    purchased: false,
    createdAt: '2026-11-24T00:00:00.000Z',
    ...overrides,
  };
}

// toLocaleString usa un espacio especial entre "$" y el número; se compara sin espacios.
const withoutSpaces = (text: string | null) => text?.replace(/\s/g, '') ?? null;

describe('precio de un deseo', () => {
  test('se muestra en pesos con punto de miles y sin centavos', () => {
    expect(withoutSpaces(formatPrice(189900))).toBe('$189.900');
    expect(withoutSpaces(formatPrice(1250000))).toBe('$1.250.000');
    expect(withoutSpaces(formatPrice(0))).toBe('$0');
  });

  test('sin precio no se muestra nada', () => {
    expect(formatPrice(null)).toBeNull();
  });

  test('acepta el precio escrito de varias formas', () => {
    expect(parsePrice('189900')).toBe(189900);
    expect(parsePrice('189.900')).toBe(189900);
    expect(parsePrice('189 900')).toBe(189900);
    expect(parsePrice('1,250,000')).toBe(1250000);
  });

  test('vacío significa "sin precio"', () => {
    expect(parsePrice('')).toBeNull();
    expect(parsePrice('   ')).toBeNull();
  });

  test('con letras o símbolos no es un precio válido', () => {
    expect(parsePrice('cien mil')).toBeUndefined();
    expect(parsePrice('$189900')).toBeUndefined();
    expect(parsePrice('-5000')).toBeUndefined();
  });
});

describe('link de un deseo', () => {
  test('acepta links http y https', () => {
    expect(isHttpLink('https://www.zara.com/co/es/chaqueta-p123.html')).toBe(true);
    expect(isHttpLink('http://tienda.co/producto')).toBe(true);
    expect(isHttpLink('  https://instagram.com/p/abc  ')).toBe(true);
  });

  test('rechaza textos que no son links web', () => {
    expect(isHttpLink('zara.com/chaqueta')).toBe(false);
    expect(isHttpLink('ftp://servidor/archivo')).toBe(false);
    expect(isHttpLink('javascript:alert(1)')).toBe(false);
    expect(isHttpLink('')).toBe(false);
  });
});

describe('filtro y búsqueda de la lista', () => {
  const items = [
    wish({ name: 'Chaqueta de jean', store: 'Zara', purchased: false }),
    wish({ name: 'Blusa de lino', store: 'Koaj', purchased: true }),
    wish({ name: 'Tenis blancos', store: null, purchased: false }),
    wish({ name: 'Camisa café', store: 'Arturo Calle', purchased: false }),
  ];
  const names = (list: WishlistItem[]) => list.map((item) => item.name);

  test('Pendientes muestra solo lo que falta por comprar', () => {
    expect(names(filterWishlist(items, 'pending', ''))).toEqual(['Chaqueta de jean', 'Tenis blancos', 'Camisa café']);
  });

  test('Comprados muestra solo lo comprado', () => {
    expect(names(filterWishlist(items, 'purchased', ''))).toEqual(['Blusa de lino']);
  });

  test('Todos muestra la lista completa', () => {
    expect(filterWishlist(items, 'all', '')).toHaveLength(4);
  });

  test('busca por nombre o por tienda, sin importar mayúsculas', () => {
    expect(names(filterWishlist(items, 'all', 'CHAQUETA'))).toEqual(['Chaqueta de jean']);
    expect(names(filterWishlist(items, 'all', 'koaj'))).toEqual(['Blusa de lino']);
  });

  test('la búsqueda ignora las tildes', () => {
    expect(names(filterWishlist(items, 'all', 'cafe'))).toEqual(['Camisa café']);
    expect(normalizeText('  Café Ñandú ')).toBe('cafe nandu');
  });

  test('el filtro y la búsqueda se combinan', () => {
    expect(filterWishlist(items, 'purchased', 'zara')).toEqual([]);
  });

  test('cuenta los deseos pendientes', () => {
    expect(countPending(items)).toBe(3);
    expect(countPending([])).toBe(0);
  });
});
