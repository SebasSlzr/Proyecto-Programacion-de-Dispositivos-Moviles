// Opciones fijas para el formulario. Cuando exista cámara + eliminación de
// fondo, "swatchColor" se calculará solo del color dominante de la foto —
// por ahora la persona lo elige a mano de esta paleta.

export const CATEGORIES = ['Camiseta', 'Pantalón', 'Chaqueta', 'Vestido', 'Zapatos', 'Accesorio'] as const;

export const SWATCH_OPTIONS = [
  '#D8D4CB', // blanco hueso
  '#3B4E6B', // azul
  '#1F1B18', // negro
  '#5C6B4F', // verde
  '#6B2F3A', // vino tinto
  '#8B7355', // café
  '#C9A0A0', // rosado
  '#4A4A4A', // gris oscuro
];