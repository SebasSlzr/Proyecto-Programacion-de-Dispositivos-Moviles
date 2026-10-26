import { useState } from 'react';
import { uploadToCloudinary } from '@/api/uploads';

// Sube una imagen local a Cloudinary y devuelve su URL pública y su identificador.
// uploadImage lanza un Error en español si algo falla; además deja el mensaje en `error`.
export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (localUri: string) => {
    setIsUploading(true);
    setError(null);
    try {
      return await uploadToCloudinary(localUri);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadImage, isUploading, error };
}