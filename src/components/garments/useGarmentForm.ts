import type { GarmentInput } from '@/api/garments';
import { CATEGORIES, SWATCH_OPTIONS } from '@/constants/garments';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useState } from 'react';

type UseGarmentFormOptions = {
  initialValues?: GarmentInput;
  onSubmit: (values: Partial<GarmentInput>) => Promise<void>;
};

// Una URI local (file://, ph://...) todavía no se ha subido; una URL http ya está en Cloudinary.
const isLocalFile = (uri: string) => !uri.startsWith('http');

// Toda la lógica del formulario de prendas: estado de los campos, la foto,
// validación, subida a Cloudinary y cálculo de lo que cambió. El componente solo dibuja.
export function useGarmentForm({ initialValues, onSubmit }: UseGarmentFormOptions) {
  const [name, setName] = useState(initialValues?.name ?? '');
  const [category, setCategory] = useState(initialValues?.category ?? CATEGORIES[0]);
  const [color, setColor] = useState(initialValues?.color ?? '');
  const [swatchColor, setSwatchColor] = useState(initialValues?.swatchColor ?? SWATCH_OPTIONS[0]);
  const [photoUri, setPhotoUri] = useState<string | null>(initialValues?.imageUrl ?? null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Recuerda la última foto subida: si la subida funcionó pero guardar falló,
  // al reintentar no se vuelve a subir la misma foto.
  const [uploaded, setUploaded] = useState<{ localUri: string; url: string; publicId: string } | null>(null);
  const { uploadImage, isUploading } = useImageUpload();

  const initialImageUrl = initialValues?.imageUrl ?? null;
  const initialPublicId = initialValues?.imagePublicId ?? null;

  // Convierte la foto actual en { imageUrl, imagePublicId }: null si se quitó,
  // los valores de siempre si no se tocó, y la sube si es un archivo local.
  const resolveImage = async () => {
    if (!photoUri) return { imageUrl: null, imagePublicId: null };
    if (!isLocalFile(photoUri)) return { imageUrl: photoUri, imagePublicId: initialPublicId };
    if (uploaded?.localUri === photoUri) return { imageUrl: uploaded.url, imagePublicId: uploaded.publicId };

    const { url, publicId } = await uploadImage(photoUri);
    setUploaded({ localUri: photoUri, url, publicId });
    return { imageUrl: url, imagePublicId: publicId };
  };

  const submit = async () => {
    if (!name.trim() || !color.trim()) {
      setError('El nombre y el color son obligatorios');
      return;
    }
    setError(null);

    const current = { name: name.trim(), category, color: color.trim(), swatchColor };
    const imageChanged = photoUri !== initialImageUrl;

    // En edición solo se manda lo que cambió; en creación se manda todo.
    let payload: Partial<GarmentInput> = current;
    if (initialValues) {
      payload = {};
      const fields = ['name', 'category', 'color', 'swatchColor'] as const;
      fields.forEach((key) => {
        if (current[key] !== initialValues[key]) payload[key] = current[key];
      });

      if (Object.keys(payload).length === 0 && !imageChanged) {
        setError('No hiciste ningún cambio');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      // Solo se toca la imagen si cambió (o si es una prenda nueva con foto):
      // una foto que no se tocó no se vuelve a subir ni se manda.
      if (!initialValues || imageChanged) {
        const image = await resolveImage();
        // Una prenda nueva sin foto no necesita mandar los campos de imagen.
        if (initialValues || image.imageUrl) payload = { ...payload, ...image };
      }
      await onSubmit(payload);
    } catch (err) {
      // Lo escrito se conserva: la persona puede corregir o reintentar.
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitLabel = isUploading ? 'Subiendo foto…' : isSubmitting ? 'Guardando…' : null;

  return {
    name,
    setName,
    category,
    setCategory,
    color,
    setColor,
    swatchColor,
    setSwatchColor,
    photoUri,
    setPhotoUri,
    submit,
    isSubmitting,
    submitLabel,
    error,
  };
}