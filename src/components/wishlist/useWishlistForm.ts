import { useState } from 'react';
import { previewWishlistLink, type WishlistInput } from '@/api/wishlist';
import { STRINGS } from '@/constants/strings';
import { useImageUpload } from '@/hooks/useImageUpload';
import type { WishlistItem } from '@/types';
import { isHttpLink, parsePrice } from '@/utils/wishlist';

const TEXT = STRINGS.wishlistScreens;

type UseWishlistFormOptions = {
  initialValues?: WishlistItem;                                   // solo en edición
  onSubmit: (values: Partial<WishlistInput>) => Promise<void>;
};

// Una URI local (file://, ph://...) todavía no se ha subido; una URL http ya está en Cloudinary.
const isLocalFile = (uri: string) => !uri.startsWith('http');

// Toda la lógica del formulario de deseos: lectura del link, campos, foto, validación,
// subida a Cloudinary y cálculo de lo que cambió. El componente solo dibuja.
export function useWishlistForm({ initialValues, onSubmit }: UseWishlistFormOptions) {
  const [url, setUrl] = useState(initialValues?.url ?? '');
  const [name, setName] = useState(initialValues?.name ?? '');
  const [store, setStore] = useState(initialValues?.store ?? '');
  const [price, setPrice] = useState(initialValues?.price != null ? String(initialValues.price) : '');
  const [category, setCategory] = useState<string | null>(initialValues?.category ?? null);

  // La foto puede venir de tres lados: la que ya tenía el deseo, la que subió el servidor
  // al leer el link (ya está en Cloudinary) o una que la usuaria toma o elige (local).
  const [photoUri, setPhotoUri] = useState<string | null>(initialValues?.imageUrl ?? null);
  const [photoPublicId, setPhotoPublicId] = useState<string | null>(initialValues?.imagePublicId ?? null);

  const [isReading, setIsReading] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [linkDone, setLinkDone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { uploadImage, isUploading } = useImageUpload();

  const changeUrl = (text: string) => {
    setUrl(text);
    setLinkDone(false);
    setLinkError(null);
  };

  // La foto que elige la usuaria es local: todavía no tiene publicId.
  const changePhoto = (uri: string | null) => {
    setPhotoUri(uri);
    setPhotoPublicId(null);
  };

  // "Leer link": el servidor descarga la página y devuelve lo que encontró.
  // Solo se rellenan los datos que llegaron; lo demás queda como estaba para llenarlo a mano.
  const readLink = async () => {
    const link = url.trim();
    if (!isHttpLink(link)) {
      setLinkError(TEXT.errorUrl);
      return;
    }
    setIsReading(true);
    setLinkError(null);
    setLinkDone(false);
    try {
      const { preview } = await previewWishlistLink(link);
      if (preview.name) setName(preview.name.slice(0, 80));
      if (preview.store) setStore(preview.store.slice(0, 60));
      if (preview.price != null) setPrice(String(preview.price));
      if (preview.category) setCategory(preview.category);
      if (preview.imageUrl) {
        setPhotoUri(preview.imageUrl);
        setPhotoPublicId(preview.imagePublicId);
      }
      setLinkDone(true);
    } catch {
      // 400 o 422: el formulario sigue disponible para llenarlo a mano.
      setLinkError(TEXT.linkFailed);
    } finally {
      setIsReading(false);
    }
  };

  // Validación en la app (la misma que hace el servidor) para avisar antes de enviar.
  const validate = (): string | null => {
    if (!name.trim()) return TEXT.errorNameRequired;
    if (name.trim().length > 80) return TEXT.errorNameMax;
    if (store.trim().length > 60) return TEXT.errorStoreMax;
    if (url.trim() && !isHttpLink(url)) return TEXT.errorUrl;
    if (parsePrice(price) === undefined) return TEXT.errorPrice;
    return null;
  };

  // Convierte la foto actual en { imageUrl, imagePublicId }: null si no hay,
  // la misma si ya está en Cloudinary, y la sube si es un archivo local.
  const resolveImage = async () => {
    if (!photoUri) return { imageUrl: null, imagePublicId: null };
    if (!isLocalFile(photoUri)) return { imageUrl: photoUri, imagePublicId: photoPublicId };
    const { url: uploadedUrl, publicId } = await uploadImage(photoUri);
    setPhotoUri(uploadedUrl);           // si guardar falla, al reintentar no se vuelve a subir
    setPhotoPublicId(publicId);
    return { imageUrl: uploadedUrl, imagePublicId: publicId };
  };

  const submit = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);

    const current = {
      name: name.trim(),
      url: url.trim() || null,
      store: store.trim() || null,
      price: parsePrice(price) ?? null,
      category,
    };
    const imageChanged = photoUri !== (initialValues?.imageUrl ?? null);

    // En edición solo se manda lo que cambió; al crear se manda todo.
    let payload: Partial<WishlistInput> = current;
    if (initialValues) {
      payload = {};
      (Object.keys(current) as (keyof typeof current)[]).forEach((key) => {
        if (current[key] !== (initialValues[key] ?? null)) Object.assign(payload, { [key]: current[key] });
      });
      if (Object.keys(payload).length === 0 && !imageChanged) {
        setError(STRINGS.messages.noChanges);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (!initialValues || imageChanged) payload = { ...payload, ...(await resolveImage()) };
      await onSubmit(payload);
    } catch (err) {
      // Mensaje del servidor (por ejemplo un 400): lo escrito se conserva para corregir.
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitLabel = isUploading ? TEXT.uploadingPhoto : isSubmitting ? TEXT.saving : null;

  return {
    url,
    changeUrl,
    readLink,
    isReading,
    linkError,
    linkDone,
    name,
    setName,
    store,
    setStore,
    price,
    setPrice,
    category,
    setCategory,
    photoUri,
    changePhoto,
    submit,
    isSubmitting,
    submitLabel,
    error,
  };
}
