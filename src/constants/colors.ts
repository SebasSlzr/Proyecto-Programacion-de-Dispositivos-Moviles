import type { ColorFamily } from '@/utils/color';

// Familias de color para el filtro del armario: etiqueta en español y un color
// de muestra para el punto del chip. Los hexadecimales viven aquí, no en componentes.
export const COLOR_FAMILIES: { key: ColorFamily; label: string; sample: string }[] = [
  { key: 'neutro', label: 'Neutros', sample: '#CFC8BC' },
  { key: 'rojo', label: 'Rojos', sample: '#B3323C' },
  { key: 'rosa', label: 'Rosados', sample: '#E59AB0' },
  { key: 'naranja', label: 'Naranjas', sample: '#E07B30' },
  { key: 'amarillo', label: 'Amarillos', sample: '#E2C044' },
  { key: 'verde', label: 'Verdes', sample: '#5E8C4A' },
  { key: 'azul', label: 'Azules', sample: '#3A5A8C' },
  { key: 'morado', label: 'Morados', sample: '#6E4A8C' },
  { key: 'cafe', label: 'Cafés', sample: '#7A5536' },
];