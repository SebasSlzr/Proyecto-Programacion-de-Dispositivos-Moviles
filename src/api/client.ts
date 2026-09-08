// Cliente HTTP: el ÚNICO archivo de la app que sabe usar `fetch`.
//
// Todo lo demás (pantallas, contexto de sesión) llama a `request()`. Si el
// día de mañana cambia la forma de hablar con el servidor (headers, manejo
// de errores, etc.), se cambia aquí y en ningún otro lado.
//
// Por ahora este archivo apunta a una API que todavía no existe: la base de
// datos la vamos a levantar con Docker (Postgres, como hizo el profe),
// siguiendo esa misma guía para el backend. Mientras tanto, login y registro
// van a fallar con "No se pudo conectar..." — eso es esperado y es justo lo
// que este archivo ya sabe reportar de forma clara.

// La URL se lee del archivo .env. Tiene que escribirse EXACTAMENTE así, con
// notación de punto: Expo busca ese texto en el código y lo reemplaza por el
// valor al compilar. Guardarlo en una variable intermedia no funcionaría.
const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001/api';

// Token de sesión. Vive en memoria: al cerrar la app se pierde y hay que
// volver a entrar. Para que sobreviva al cierre, instalar `expo-secure-store`
// y guardar/leer el token ahí en vez de en esta variable.
let token: string | null = null;

/** La llama el contexto de sesión al entrar (token) y al salir (null). */
export function setToken(value: string | null): void {
  token = value;
}

/**
 * Hace una petición a la API y devuelve el JSON ya tipado.
 *
 * - Sin `body` -> GET. Con `body` -> POST enviándolo como JSON.
 * - Si hay sesión activa, adjunta la cabecera `Authorization: Bearer <token>`.
 * - Si el servidor responde con error, lanza un Error con SU mensaje, que es
 *   el que la pantalla muestra al usuario.
 *
 * @param path Ruta relativa a la API, empezando por "/". Ej: "/auth/login".
 */
export async function request<T>(path: string, body?: unknown): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      method: body === undefined ? 'GET' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    // `fetch` solo falla así cuando no hubo respuesta: servidor apagado, URL
    // equivocada, o el dispositivo no alcanza esa dirección (ver .env.example).
    throw new Error(`No se pudo conectar con ${API_URL}. ¿Está encendido el servidor?`);
  }

  // Si el backend cae o devuelve HTML en vez de JSON, seguimos con un objeto
  // vacío en lugar de reventar.
  const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;

  if (!response.ok) {
    // Igual que en el backend guía: los errores llegan como { error: "mensaje" }.
    const message = typeof data['error'] === 'string' ? data['error'] : null;
    throw new Error(message ?? `Error ${response.status} al llamar ${path}`);
  }

  return data as T;
}
