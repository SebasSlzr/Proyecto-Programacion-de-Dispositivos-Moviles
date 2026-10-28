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

   // Se usa XMLHttpRequest y no fetch: desde SDK 58 el fetch global es expo/fetch,
  // que no acepta archivos { uri, name, type } en FormData ("Unsupported FormDataPart").
  // XMLHttpRequest sigue usando la red nativa de React Native, que sí los sube.
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`);
    xhr.timeout = UPLOAD_TIMEOUT_MS;
    xhr.onload = () => {
      let body: CloudinaryResponse | null = null;
      try {
        body = JSON.parse(xhr.responseText) as CloudinaryResponse;
      } catch {
        body = null;
      }
      if (xhr.status < 200 || xhr.status >= 300 || !body?.secure_url || !body.public_id) {
        reject(new Error(body?.error?.message ?? 'No se pudo subir la imagen'));
        return;
      }
      resolve({ url: body.secure_url, publicId: body.public_id });
    };
    xhr.ontimeout = () => reject(new Error('La subida de la foto tardó demasiado. Intenta de nuevo.'));
    xhr.onerror = () => reject(new Error('No se pudo conectar para subir la foto.'));
    xhr.send(form); // sin Content-Type: React Native lo agrega con el límite del formulario
  });
}