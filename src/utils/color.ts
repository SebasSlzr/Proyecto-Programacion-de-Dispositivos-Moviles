// Utilidades de color: funciones puras (no usan React, red ni base de datos).
// Las usan el filtro por color del armario y sugerirOutfit.

export type ColorFamily =
  | 'neutro'
  | 'rojo'
  | 'naranja'
  | 'amarillo'
  | 'verde'
  | 'azul'
  | 'morado'
  | 'rosa'
  | 'cafe';

export type Hsl = { h: number; s: number; l: number };

// Acepta "#RGB" o "#RRGGBB" (con o sin #). Devuelve null si no es un color válido.
function parseHex(hex: string): [number, number, number] | null {
  const clean = hex.trim().replace(/^#/, '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16)) as [number, number, number];
}

// Convierte a HSL: h (tono) en grados de 0 a 360; s (saturación) y l (luminosidad) de 0 a 1.
export function hexToHsl(hex: string): Hsl {
  const rgb = parseHex(hex);
  if (!rgb) throw new Error(`Color inválido: ${hex}`);
  const [r, g, b] = rgb.map((v) => v / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return { h: 0, s: 0, l };
  const s = d / (1 - Math.abs(2 * l - 1));
  let h: number;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  h = Math.round(h * 60);
  if (h < 0) h += 360;
  return { h, s, l };
}

// Distancia entre dos tonos en el círculo cromático: de 0 (iguales) a 180 (opuestos).
export function hueDistance(a: number, b: number): number {
  const diff = Math.abs(a - b) % 360;
  return diff > 180 ? 360 - diff : diff;
}

// Casi negro, casi blanco, gris, o beige claro: colores sin tono definido.
function isAchromatic({ h, s, l }: Hsl): boolean {
  if (l < 0.12 || l > 0.92) return true;                      // casi negro o casi blanco
  if (s < 0.12) return true;                                   // grises
  if (h >= 20 && h <= 50 && s < 0.5 && l > 0.6) return true;   // beige, crema, arena
  return false;
}

// ¿Combina con todo? Además de los acromáticos, en moda se consideran neutros
// los colores muy apagados y los azules de jean y marino.
export function isNeutral(hex: string): boolean {
  if (!parseHex(hex)) return true; // dato inválido: no bloquea una combinación
  const hsl = hexToHsl(hex);
  if (isAchromatic(hsl)) return true;
  if (hsl.s < 0.2) return true;                                                // colores muy apagados
  if (hsl.h >= 195 && hsl.h <= 240 && hsl.s < 0.5 && hsl.l < 0.6) return true; // jean y azul marino
  return false;
}

// Familia de color para filtrar el armario. Un jean es de la familia "azul"
// aunque combine con todo (isNeutral): filtrar y combinar son cosas distintas.
export function getColorFamily(hex: string): ColorFamily {
  if (!parseHex(hex)) return 'neutro';
  const hsl = hexToHsl(hex);
  const { h, s, l } = hsl;
  if (isAchromatic(hsl)) return 'neutro';
  if (h >= 15 && h < 50 && s < 0.6 && l < 0.62) return 'cafe'; // tonos tierra
  if (h >= 345 || h < 15) return l > 0.65 ? 'rosa' : 'rojo';   // un rojo claro es rosado
  if (h < 40) return 'naranja';
  if (h < 65) return 'amarillo';
  if (h < 170) return 'verde';
  if (h < 255) return 'azul';
  if (h < 290) return 'morado';
  return 'rosa';
}