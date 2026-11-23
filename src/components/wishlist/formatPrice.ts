// Muestra un precio en pesos colombianos sin decimales: 189900 -> "$ 189.900".
// Devuelve null si no hay precio, para que la tarjeta simplemente no lo muestre.
export function formatPrice(price: number | null): string | null {
  if (price === null) return null;
  return price.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
}
