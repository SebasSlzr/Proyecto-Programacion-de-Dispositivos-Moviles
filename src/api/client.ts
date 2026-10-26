const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error(
    'Falta EXPO_PUBLIC_API_URL en el archivo .env: revisa que exista en la raíz del proyecto y reinicia con "npx expo start -c".'
  );
}

const TIMEOUT_MS = 15000;

let authToken: string | null = null;

export function setToken(token: string | null) {
  authToken = token;
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: object;
};

// Sin "method" se infiere: GET si no hay body, POST si lo hay.
export async function request<T>(path: string, { method, body }: RequestOptions = {}): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${API_URL}${path}`, {
      method: method ?? (body ? 'POST' : 'GET'),
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': '1',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) throw new Error(data?.message ?? 'Ocurrió un error inesperado');
    if (data === null) throw new Error('El servidor respondió algo inesperado');
    return data as T;
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      throw new Error('El servidor tardó demasiado en responder. Revisa tu conexión.');
    }
    if (error instanceof TypeError) {
      throw new Error('No se pudo conectar con el servidor.');
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}