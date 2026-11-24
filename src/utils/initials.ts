// Iniciales para el avatar de un usuario en el panel de administración.
// - Toma la primera letra del primer nombre y la del último: "Ana María López" -> "AL".
// - Con una sola palabra usa solo esa letra: "Bruno" -> "B".
// - Sin nombre (o solo espacios) devuelve "?" para que el círculo nunca quede vacío.
// Es una función pura: no depende de React, por eso se prueba con Jest.
export function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';

  const first = words[0].charAt(0);
  const last = words.length > 1 ? words[words.length - 1].charAt(0) : '';
  return (first + last).toLocaleUpperCase('es-CO');
}
