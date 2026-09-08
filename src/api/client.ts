// URL base del backend. Cambia la IP por la que te dio "ipconfig"
// (adaptador WiFi) — el celular debe estar en la misma red.
const API_URL = 'http://172.20.10.8:4000/api';

let authToken: string | null = null;

/** Guarda el token en memoria para que las siguientes peticiones lo incluyan. */
export function setToken(token: string | null) {
  authToken = token;
}

/**
 * Sin `body` hace un GET, con `body` hace un POST con JSON.
 * Si el backend responde con error, lanza un Error con el mensaje que
 * mandó el servidor — así lo atrapa directo la pantalla que llamó a esto.
 */
export async function request<T>(path: string, body?: object): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: body ? 'POST' : 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? 'Ocurrió un error inesperado');
  }

  return data as T;
}