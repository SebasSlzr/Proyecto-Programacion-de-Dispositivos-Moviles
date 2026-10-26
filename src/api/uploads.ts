import { request } from './client';

type SignatureResponse = {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  publicId: string;
};

type CloudinaryResponse = {
  secure_url?: string;
  public_id?: string;
  error?: { message: string };
};

const UPLOAD_TIMEOUT_MS = 60000;

// 1) Pide una firma al backend (con el token de la sesión).
// 2) Sube la foto directo a Cloudinary. Cloudinary no es nuestro servidor, así que
//    no se usa request() de client.ts ni se manda el token.
export async function uploadToCloudinary(localUri: string): Promise<{ url: string; publicId: string }> {
  const sign = await request<SignatureResponse>('/uploads/signature', { method: 'POST', body: {} });

  const form = new FormData();
  form.append('file', { uri: localUri, name: 'prenda.jpg', type: 'image/jpeg' } as unknown as Blob);
  form.append('api_key', sign.apiKey);
  form.append('timestamp', String(sign.timestamp));
  form.append('public_id', sign.publicId);
  form.append('signature', sign.signature);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT_MS);

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`, {
      method: 'POST',
      body: form, // sin Content-Type: React Native lo agrega con el límite del formulario
      signal: controller.signal,
    });
    const data = (await response.json().catch(() => null)) as CloudinaryResponse | null;

    if (!response.ok || !data?.secure_url || !data.public_id) {
      throw new Error(data?.error?.message ?? 'No se pudo subir la imagen');
    }
    return { url: data.secure_url, publicId: data.public_id };
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      throw new Error('La subida de la foto tardó demasiado. Intenta de nuevo.');
    }
    if (error instanceof TypeError) {
      throw new Error('No se pudo conectar para subir la foto.');
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}