// Sugerencias de outfits por armonía de color. Funciones puras: no usan React, red ni base de datos.
// Las usan el botón "Sugerir outfit", la notificación "Tu outfit de hoy" y la regla de los 3 outfits.
import type { Garment, WishlistItem } from '@/types';
import { OUTFIT_SLOTS, type OutfitSlotKey } from '@/constants/outfits';
import { hexToHsl, hueDistance, isNeutral } from '@/utils/color';

export type Harmony = 'complementario' | 'analogo' | 'neutro';

export type OutfitSuggestion = {
  head: string | null;
  torso: string[];
  legs: string | null;
  feet: string | null;
  harmony: Harmony;
  anchorId: string;
};

export const OUTFITS_MINIMOS_PARA_COMPRAR = 3;

// Regla 4: como máximo dos prendas con color además del ancla.
const MAX_PRENDAS_CON_COLOR = 2;

// Regla 1 (zonas): una prenda solo va en las zonas cuya lista de categorías la incluye.
function zonasPermitidas(prenda: Garment): OutfitSlotKey[] {
  return OUTFIT_SLOTS
    .filter((zona) => (zona.categories as readonly string[]).includes(prenda.category))
    .map((zona) => zona.key);
}

// Regla 1 (zonas), para armar: los accesorios van en la cabeza y el vestido se pone desde el torso
// (ocupa torso y piernas), así que no se cuenta como prenda de piernas.
function vaEnZona(prenda: Garment, zona: OutfitSlotKey): boolean {
  if (!zonasPermitidas(prenda).includes(zona)) return false;
  if (zona === 'torso' && prenda.category === 'Accesorio') return false;
  if (zona === 'legs' && prenda.category === 'Vestido') return false;
  return true;
}

// Regla 4 (armonía): neutro combina con todo; complementario 150-180 grados; análogo 45 o menos.
function armoniaCon(ancla: Garment, prenda: Garment): Harmony | null {
  if (isNeutral(prenda.swatchColor) || isNeutral(ancla.swatchColor)) return 'neutro';
  const distancia = hueDistance(hexToHsl(ancla.swatchColor).h, hexToHsl(prenda.swatchColor).h);
  if (distancia >= 150) return 'complementario';
  if (distancia <= 45) return 'analogo';
  return null;
}

// Armonía del outfit completo: se miran todos los pares de prendas con color.
// Complementario si algún par es opuesto; si no, análogo si algún par es vecino; si no, neutro.
function armoniaDelOutfit(conColor: Garment[]): Harmony {
  const relaciones: (Harmony | null)[] = [];
  conColor.forEach((a, i) => {
    conColor.slice(i + 1).forEach((b) => relaciones.push(armoniaCon(a, b)));
  });
  if (relaciones.includes('complementario')) return 'complementario';
  if (relaciones.includes('analogo')) return 'analogo';
  return 'neutro';
}

// Regla 5 (determinismo): todo azar pasa por la función random que llega.
function elegirAlAzar<T>(lista: T[], random: () => number): T | undefined {
  if (lista.length === 0) return undefined;
  const indice = Math.min(Math.floor(random() * lista.length), lista.length - 1);
  return lista[indice];
}

// Regla 3 (ancla automática): una prenda de torso o piernas que no esté excluida,
// con color si hay alguna; si todas son neutras, una neutra (y el outfit sale neutro).
function elegirAncla(prendas: Garment[], excluir: string[], random: () => number): Garment | undefined {
  const candidatas = prendas.filter(
    (p) => !excluir.includes(p.id) && (vaEnZona(p, 'torso') || vaEnZona(p, 'legs')),
  );
  const conColor = candidatas.filter((p) => !isNeutral(p.swatchColor));
  return elegirAlAzar(conColor.length > 0 ? conColor : candidatas, random);
}

export function sugerirOutfit(
  prendas: Garment[],
  opciones?: {
    random?: () => number;
    excluir?: string[];
    ancla?: Garment;
  },
): OutfitSuggestion | null {
  const random = opciones?.random ?? Math.random;
  const excluir = opciones?.excluir ?? [];

  // Regla 3 (ancla): la que llega (aunque no esté en el armario) o una elegida al azar.
  const ancla = opciones?.ancla ?? elegirAncla(prendas, excluir, random);
  if (!ancla || zonasPermitidas(ancla).length === 0) return null;

  let head: string | null = null;
  let legs: string | null = null;
  let feet: string | null = null;
  const capasTorso: Garment[] = [];
  const usadas = new Set<string>([ancla.id]);
  const conColor: Garment[] = isNeutral(ancla.swatchColor) ? [] : [ancla];
  let coloresExtra = 0; // prendas con color además del ancla

  // El ancla va primero, en su zona.
  if (vaEnZona(ancla, 'torso')) capasTorso.push(ancla);
  else if (vaEnZona(ancla, 'legs')) legs = ancla.id;
  else if (vaEnZona(ancla, 'feet')) feet = ancla.id;
  else head = ancla.id;

  // Regla 4 (armonía) para una zona: primero las prendas con color que armonizan con todas
  // las de color que ya están; si no hay, una neutra; si tampoco, la zona queda vacía.
  const escoger = (puedeIr: (p: Garment) => boolean): Garment | undefined => {
    const libres = prendas.filter((p) => !usadas.has(p.id) && puedeIr(p));
    const queArmonizan =
      coloresExtra < MAX_PRENDAS_CON_COLOR
        ? libres.filter((p) => !isNeutral(p.swatchColor) && conColor.every((c) => armoniaCon(c, p) !== null))
        : [];
    const neutras = libres.filter((p) => isNeutral(p.swatchColor));
    const elegida = elegirAlAzar(queArmonizan, random) ?? elegirAlAzar(neutras, random);
    if (!elegida) return undefined;
    usadas.add(elegida.id);
    if (!isNeutral(elegida.swatchColor)) {
      conColor.push(elegida);
      coloresExtra += 1;
    }
    return elegida;
  };

  // Torso, primera capa (si el ancla no está en el torso). Si las piernas ya están ocupadas, no va un vestido.
  if (capasTorso.length === 0) {
    const base = escoger((p) => vaEnZona(p, 'torso') && !(legs !== null && p.category === 'Vestido'));
    if (base) capasTorso.push(base);
  }

  // Piernas, salvo que el torso lleve un vestido.
  if (legs === null && !capasTorso.some((p) => p.category === 'Vestido')) {
    legs = escoger((p) => vaEnZona(p, 'legs'))?.id ?? null;
  }

  // Torso, segunda capa (regla 1): con dos capas hay exactamente una chaqueta, nunca dos.
  // Una chaqueta sola pide algo debajo; sobre una camiseta o un vestido, la chaqueta es opcional.
  const primera = capasTorso[0];
  if (primera) {
    const esChaqueta = primera.category === 'Chaqueta';
    if (esChaqueta || random() < 0.5) {
      const segunda = escoger(
        (p) =>
          vaEnZona(p, 'torso') &&
          (esChaqueta ? p.category !== 'Chaqueta' : p.category === 'Chaqueta') &&
          !(legs !== null && p.category === 'Vestido'),
      );
      if (segunda) capasTorso.push(segunda);
    }
  }

  // Regla 2 (mínimo): torso y piernas, o un vestido. Si no, no hay outfit.
  const llevaVestido = capasTorso.some((p) => p.category === 'Vestido');
  if (capasTorso.length === 0 || (legs === null && !llevaVestido)) return null;

  // Pies y cabeza se agregan si hay prendas para esa zona.
  if (feet === null) feet = escoger((p) => vaEnZona(p, 'feet'))?.id ?? null;
  if (head === null) head = escoger((p) => vaEnZona(p, 'head'))?.id ?? null;

  return {
    head,
    torso: capasTorso.map((p) => p.id),
    legs,
    feet,
    harmony: armoniaDelOutfit(conColor),
    anchorId: ancla.id,
  };
}

// Azar con semilla: siempre repite la misma secuencia de números entre 0 y 1 (como Math.random).
// Es un generador congruencial lineal: cada número sale del anterior con una multiplicación y una suma.
function azarConSemilla(semilla: number): () => number {
  let estado = semilla;
  return () => {
    estado = (estado * 1664525 + 1013904223) % 4294967296;
    return estado / 4294967296;
  };
}

// Regla de los 3 outfits: hasta max sugerencias distintas que incluyen la prenda (como ancla).
// Dos sugerencias son iguales si tienen las mismas prendas en las mismas zonas.
// Usa azar con semilla fija, así el mismo armario siempre da el mismo conteo.
export function outfitsConPrenda(prenda: Garment, armario: Garment[], max = 5): OutfitSuggestion[] {
  const random = azarConSemilla(1);
  const resultado: OutfitSuggestion[] = [];
  const vistas = new Set<string>();
  const intentos = max * 20;

  for (let i = 0; i < intentos && resultado.length < max; i++) {
    const sugerencia = sugerirOutfit(armario, { ancla: prenda, random });
    if (!sugerencia) continue;
    const clave = [
      sugerencia.head,
      [...sugerencia.torso].sort().join('+'),
      sugerencia.legs,
      sugerencia.feet,
    ].join('|');
    if (vistas.has(clave)) continue;
    vistas.add(clave);
    resultado.push(sugerencia);
  }
  return resultado;
}

// Regla de los 3 outfits: convierte un deseo de la wishlist en una prenda para analizarlo.
// Hace falta la categoría (para saber en qué zona va) y el color detectado de su foto.
// Si falta alguno, devuelve null y la pantalla pide completar los datos.
export function deseoComoPrenda(deseo: WishlistItem): Garment | null {
  if (!deseo.category || !deseo.dominantColor) return null;
  return {
    id: `deseo-${deseo.id}`, // prefijo para que nunca choque con el id de una prenda del armario
    name: deseo.name,
    category: deseo.category,
    color: '',
    swatchColor: deseo.dominantColor,
    imageUrl: deseo.imageUrl,
    imagePublicId: deseo.imagePublicId,
    isFavorite: false,
    dominantColor: deseo.dominantColor,
  };
}

export type VeredictoCompra = 'vale-la-pena' | 'pensarlo' | 'no-combina';

// Regla de los 3 outfits: con 3 o más vale la pena; con 1 o 2, pensarlo; con 0, no combina.
export function veredictoDeCompra(cantidadDeOutfits: number): VeredictoCompra {
  if (cantidadDeOutfits >= OUTFITS_MINIMOS_PARA_COMPRAR) return 'vale-la-pena';
  if (cantidadDeOutfits > 0) return 'pensarlo';
  return 'no-combina';
}
