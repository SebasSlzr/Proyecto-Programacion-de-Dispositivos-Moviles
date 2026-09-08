// Datos de prueba. Cuando exista base de datos, esto se reemplaza por
// las prendas reales del usuario obtenidas del backend — por ahora
// nos sirve para mostrar cómo se va a ver el armario con contenido.

export type Garment = {
  id: string;
  name: string;
  category: string;
  color: string;       // nombre del color, para el futuro algoritmo de combinación
  swatchColor: string; // hex para pintar el placeholder mientras no hay fotos reales
};

export const mockGarments: Garment[] = [
  { id: '1', name: 'Camiseta blanca básica', category: 'Camiseta', color: 'Blanco', swatchColor: '#D8D4CB' },
  { id: '2', name: 'Jean azul clásico', category: 'Pantalón', color: 'Azul', swatchColor: '#3B4E6B' },
  { id: '3', name: 'Chaqueta de cuero', category: 'Chaqueta', color: 'Negro', swatchColor: '#1F1B18' },
  { id: '4', name: 'Vestido midi floral', category: 'Vestido', color: 'Verde', swatchColor: '#5C6B4F' },
  { id: '5', name: 'Tenis blancos', category: 'Zapatos', color: 'Blanco', swatchColor: '#C9C4B8' },
  { id: '6', name: 'Bufanda de lana', category: 'Accesorio', color: 'Vino tinto', swatchColor: '#6B2F3A' },
  { id: '7', name: 'Gorra de lana', category: 'Accesorio', color: 'Gris', swatchColor: '#8A8A8A' }
];