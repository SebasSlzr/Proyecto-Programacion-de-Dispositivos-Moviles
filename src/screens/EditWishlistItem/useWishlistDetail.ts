import { useEffect, useState } from 'react';
import { Linking } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import {
  deleteWishlistItem,
  getWishlistItem,
  moveWishlistToWardrobe,
  setWishlistPurchased,
  updateWishlistItem,
  type WishlistInput,
} from '@/api/wishlist';
import { STRINGS } from '@/constants/strings';
import { useConfirm } from '@/context/ConfirmDialogContext';
import type { WishlistItem } from '@/types';

const TEXT = STRINGS.wishlistScreens;

// Detalle de un deseo. Recibe SOLO el id por la ruta y carga el deseo con getWishlistItem:
// así funciona igual desde la lista que desde la notificación push (que abre /wishlist/<id>).
export function useWishlistDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { confirm, alert } = useConfirm();

  const [item, setItem] = useState<WishlistItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isBusy, setIsBusy] = useState(false);   // mientras se marca comprado, se pasa al armario o se borra

  useEffect(() => {
    let active = true;  // si la pantalla se cierra antes de que llegue la respuesta, no se actualiza
    getWishlistItem(id)
      .then(({ item: loaded }) => active && setItem(loaded))
      .catch((err: Error) => active && setLoadError(err.message))   // 404 si no existe o es de otra persona
      .finally(() => active && setIsLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  // Si se abrió desde la notificación no hay pantalla anterior: se va a la lista de deseos.
  const close = () => (router.canGoBack() ? router.back() : router.replace('/(drawer)/(tabs)/wishlist'));

  // Corre una acción mostrando su error sin cerrar la pantalla.
  const run = async (action: () => Promise<void>) => {
    setIsBusy(true);
    setActionError(null);
    try {
      await action();
    } catch (err) {
      setActionError((err as Error).message);
    } finally {
      setIsBusy(false);
    }
  };

  const togglePurchased = () =>
    run(async () => {
      if (!item) return;
      const { item: updated } = await setWishlistPurchased(item.id, !item.purchased);
      setItem(updated);
    });

  const openLink = async () => {
    if (!item?.url) return;
    try {
      await Linking.openURL(item.url);
    } catch {
      setActionError(TEXT.openLinkError);
    }
  };

  // Solo se puede si el deseo tiene foto (la prenda nueva usa esa foto) y categoría.
  const canMove = !!item?.imageUrl && !!item?.category;
  const moveHint = !item?.imageUrl ? TEXT.needsPhoto : !item?.category ? TEXT.needsCategory : null;

  const moveToWardrobe = async () => {
    if (!item?.category || !canMove) return;
    const accepted = await confirm({ title: TEXT.moveTitle, message: TEXT.moveMessage, confirmLabel: TEXT.moveToWardrobe });
    if (!accepted) return;
    await run(async () => {
      await moveWishlistToWardrobe(item.id, { category: item.category! });
      await alert({ title: TEXT.movedTitle, message: TEXT.movedMessage });
      close();
    });
  };

  const confirmDelete = async () => {
    if (!item) return;
    const accepted = await confirm({
      title: TEXT.deleteTitle,
      message: TEXT.deleteMessage,
      confirmLabel: TEXT.deleteConfirm,
      tone: 'danger',
    });
    if (!accepted) return;
    await run(async () => {
      await deleteWishlistItem(item.id);
      close();
    });
  };

  // Guardar desde el formulario de edición: el formulario ya manda solo lo que cambió.
  const saveChanges = async (changes: Partial<WishlistInput>) => {
    const { item: updated } = await updateWishlistItem(id, changes);
    setItem(updated);
    setIsEditing(false);
  };

  return {
    item,
    isLoading,
    loadError,
    actionError,
    isBusy,
    isEditing,
    startEditing: () => setIsEditing(true),
    stopEditing: () => setIsEditing(false),
    close,
    togglePurchased,
    openLink,
    canMove,
    moveHint,
    moveToWardrobe,
    confirmDelete,
    saveChanges,
  };
}
