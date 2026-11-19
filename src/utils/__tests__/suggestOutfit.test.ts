import { describe, expect, test } from '@jest/globals';
import type { Garment } from '@/types';
import {
  OUTFITS_MINIMOS_PARA_COMPRAR,
  outfitsConPrenda,
  sugerirOutfit,
  type OutfitSuggestion,
} from '@/utils/suggestOutfit';

// Colores de prueba (hex) y su tono aproximado en la rueda.
const BLANCO = '#FFFFFF'; // neutro
const NEGRO = '#111111'; // neutro
const JEAN = '#3B5998'; // neutro (azul de jean)
const AZUL = '#1E64FF'; // 221 grados
const NARANJA = '#FF8000'; // 30 grados: opuesto al azul
const VERDE = '#00C853'; // 125 grados: a 96 del azul, no combina

// Crea una prenda con id único; solo importan la categoría y el color.
let contador = 0;
function prenda({ category, swatchColor }: { category: string; swatchColor: string }): Garment {
  contador += 1;
  return {
    id: `p${contador}`,
    name: `${category} ${contador}`,
    category,
    color: '',
    swatchColor,
    imageUrl: null,
    imagePublicId: null,
    isFavorite: false,
    dominantColor: null,
  };
}

// Varias funciones random fijas, para recorrer distintos caminos del azar.
const AZARES = [0, 0.25, 0.5, 0.75, 0.99].map((valor) => () => valor);

// Una función random que repite una secuencia fija de números.
function secuencia(valores: number[]): () => number {
  let i = 0;
  return () => valores[i++ % valores.length] ?? 0;
}

// Todos los ids que usa una sugerencia, sin los vacíos.
function idsDe(s: OutfitSuggestion): (string | null)[] {
  return [s.head, ...s.torso, s.legs, s.feet].filter((id) => id !== null);
}

describe('sugerirOutfit', () => {
  test('con solo prendas neutras el outfit es neutro', () => {
    const armario = [
      prenda({ category: 'Camiseta', swatchColor: BLANCO }),
      prenda({ category: 'Pantalón', swatchColor: JEAN }),
      prenda({ category: 'Zapatos', swatchColor: NEGRO }),
    ];
    for (const random of AZARES) {
      expect(sugerirOutfit(armario, { random })?.harmony).toBe('neutro');
    }
  });

  test('sin piernas ni vestido devuelve null', () => {
    const armario = [
      prenda({ category: 'Camiseta', swatchColor: AZUL }),
      prenda({ category: 'Camiseta', swatchColor: BLANCO }),
      prenda({ category: 'Zapatos', swatchColor: NEGRO }),
    ];
    expect(sugerirOutfit(armario)).toBeNull();
  });

  test('nunca repite prendas y el torso tiene como máximo 2 capas distintas', () => {
    const armario = [
      prenda({ category: 'Camiseta', swatchColor: BLANCO }),
      prenda({ category: 'Camiseta', swatchColor: NEGRO }),
      prenda({ category: 'Chaqueta', swatchColor: NEGRO }),
      prenda({ category: 'Chaqueta', swatchColor: JEAN }),
      prenda({ category: 'Pantalón', swatchColor: JEAN }),
      prenda({ category: 'Zapatos', swatchColor: BLANCO }),
      prenda({ category: 'Accesorio', swatchColor: NEGRO }),
    ];
    for (const random of AZARES) {
      const s = sugerirOutfit(armario, { random });
      expect(s).not.toBeNull();
      if (!s) return;
      const ids = idsDe(s);
      expect(new Set(ids).size).toBe(ids.length);
      expect(s.torso.length).toBeLessThanOrEqual(2);
      const categorias = s.torso.map((id) => armario.find((p) => p.id === id)?.category);
      expect(new Set(categorias).size).toBe(categorias.length); // nunca dos chaquetas
    }
  });

  test('un vestido deja las piernas en null', () => {
    const vestido = prenda({ category: 'Vestido', swatchColor: NEGRO });
    const armario = [vestido, prenda({ category: 'Pantalón', swatchColor: JEAN })];
    for (const random of AZARES) {
      const s = sugerirOutfit(armario, { random, ancla: vestido });
      expect(s?.torso).toContain(vestido.id);
      expect(s?.legs).toBeNull();
    }
  });

  test('con un ancla azul elige la naranja como complementaria', () => {
    const camisetaAzul = prenda({ category: 'Camiseta', swatchColor: AZUL });
    const pantalonNaranja = prenda({ category: 'Pantalón', swatchColor: NARANJA });
    const armario = [camisetaAzul, pantalonNaranja, prenda({ category: 'Pantalón', swatchColor: VERDE })];
    for (const random of AZARES) {
      const s = sugerirOutfit(armario, { random, ancla: camisetaAzul });
      expect(s?.legs).toBe(pantalonNaranja.id);
      expect(s?.harmony).toBe('complementario');
    }
  });

  test('como máximo dos prendas con color además del ancla', () => {
    const camisetaAzul = prenda({ category: 'Camiseta', swatchColor: AZUL });
    const naranjas = [
      prenda({ category: 'Chaqueta', swatchColor: NARANJA }),
      prenda({ category: 'Pantalón', swatchColor: NARANJA }),
      prenda({ category: 'Zapatos', swatchColor: NARANJA }),
      prenda({ category: 'Accesorio', swatchColor: NARANJA }),
    ];
    const armario = [
      camisetaAzul,
      ...naranjas,
      prenda({ category: 'Pantalón', swatchColor: NEGRO }),
      prenda({ category: 'Zapatos', swatchColor: BLANCO }),
      prenda({ category: 'Accesorio', swatchColor: NEGRO }),
    ];
    const idsNaranjas = naranjas.map((p) => p.id);
    for (const random of AZARES) {
      const s = sugerirOutfit(armario, { random, ancla: camisetaAzul });
      expect(s).not.toBeNull();
      if (!s) return;
      const conColor = idsDe(s).filter((id) => id !== null && idsNaranjas.includes(id));
      expect(conColor.length).toBeLessThanOrEqual(2);
    }
  });

  test('la misma función random da el mismo resultado', () => {
    const armario = [
      prenda({ category: 'Camiseta', swatchColor: AZUL }),
      prenda({ category: 'Camiseta', swatchColor: NARANJA }),
      prenda({ category: 'Chaqueta', swatchColor: NEGRO }),
      prenda({ category: 'Pantalón', swatchColor: JEAN }),
      prenda({ category: 'Pantalón', swatchColor: NEGRO }),
      prenda({ category: 'Zapatos', swatchColor: BLANCO }),
    ];
    const numeros = [0.1, 0.7, 0.4, 0.9, 0.3];
    const primera = sugerirOutfit(armario, { random: secuencia(numeros) });
    const segunda = sugerirOutfit(armario, { random: secuencia(numeros) });
    expect(primera).not.toBeNull();
    expect(segunda).toEqual(primera);
  });

  test('excluir evita repetir el ancla anterior', () => {
    const camisetaAzul = prenda({ category: 'Camiseta', swatchColor: AZUL });
    const camisetaNaranja = prenda({ category: 'Camiseta', swatchColor: NARANJA });
    const armario = [camisetaAzul, camisetaNaranja, prenda({ category: 'Pantalón', swatchColor: NEGRO })];
    for (const random of AZARES) {
      const s = sugerirOutfit(armario, { random, excluir: [camisetaAzul.id] });
      expect(s?.anchorId).toBe(camisetaNaranja.id);
    }
  });
});

describe('outfitsConPrenda', () => {
  const armario = [
    prenda({ category: 'Camiseta', swatchColor: BLANCO }),
    prenda({ category: 'Camiseta', swatchColor: NEGRO }),
    prenda({ category: 'Pantalón', swatchColor: JEAN }),
    prenda({ category: 'Pantalón', swatchColor: NEGRO }),
    prenda({ category: 'Zapatos', swatchColor: BLANCO }),
  ];

  test('siempre incluye la prenda y no repite sugerencias', () => {
    const chaquetaDeseo = prenda({ category: 'Chaqueta', swatchColor: NARANJA }); // no está en el armario
    const resultado = outfitsConPrenda(chaquetaDeseo, armario);
    expect(resultado.length).toBeGreaterThanOrEqual(OUTFITS_MINIMOS_PARA_COMPRAR);
    for (const s of resultado) {
      expect(s.anchorId).toBe(chaquetaDeseo.id);
      expect(idsDe(s)).toContain(chaquetaDeseo.id);
    }
    const claves = resultado.map((s) => JSON.stringify(idsDe(s)));
    expect(new Set(claves).size).toBe(claves.length);
  });

  test('respeta el máximo pedido', () => {
    const chaquetaDeseo = prenda({ category: 'Chaqueta', swatchColor: NARANJA });
    expect(outfitsConPrenda(chaquetaDeseo, armario, 2)).toHaveLength(2);
  });

  test('con un armario pequeño devuelve menos de 3', () => {
    const camisetaDeseo = prenda({ category: 'Camiseta', swatchColor: AZUL });
    const armarioPequeno = [
      prenda({ category: 'Pantalón', swatchColor: NEGRO }),
      prenda({ category: 'Zapatos', swatchColor: BLANCO }),
    ];
    const resultado = outfitsConPrenda(camisetaDeseo, armarioPequeno);
    expect(resultado.length).toBeLessThan(OUTFITS_MINIMOS_PARA_COMPRAR);
    expect(resultado).toHaveLength(1);
  });
});
