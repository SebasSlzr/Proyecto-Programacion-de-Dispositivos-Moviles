const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error(
    'Falta EXPO_PUBLIC_API_URL en el archivo .env — revisa que exista en la raíz del proyecto y reinicia con "npx expo start -c".'
  );
}

let authToken: string | null = null;

export function setToken(token: string | null) {
  authToken = token;
}

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
  if (!response.ok) throw new Error(data.message ?? 'Ocurrió un error inesperado');
  return data as T;
}