import { useCallback, useState } from 'react';
import { useRouter } from 'expo-router';
import { deleteUser, getUserWardrobe } from '@/api/admin';
import { STRINGS } from '@/constants/strings';
import { useConfirm } from '@/context/ConfirmDialogContext';
import { useFocusFetch } from '@/hooks/useFocusFetch';
import type { UserWardrobe } from '@/types';

export type DetailTab = 'garments' | 'outfits';

// Lógica del detalle de un usuario para el administrador (solo lectura):
// carga sus prendas y outfits con getUserWardrobe, maneja la pestaña elegida,
// volver al panel, abrir la política de privacidad y eliminar la cuenta.
export function useAdminUserDetail(id: string) {
  const router = useRouter();
  const { confirm } = useConfirm();
  const [tab, setTab] = useState<DetailTab>('garments');
  const [actionError, setActionError] = useState<string | null>(null);

  // useFocusFetch exige una función estable. Esta depende del id de la ruta, así que
  // no puede declararse fuera del hook: useCallback la mantiene igual mientras el id no cambie.
  const fetchWardrobe = useCallback(() => getUserWardrobe(id), [id]);
  const { data: wardrobe, isLoading, isRefreshing, error, onRefresh } = useFocusFetch<UserWardrobe | null>(
    fetchWardrobe,
    null
  );

  // Si se llegó directo a la ruta (sin historial), volver lleva al panel.
  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/users'));

  const openPrivacy = () => router.push('/privacy');

  // Un administrador no se puede eliminar (el backend responde 403): el botón no aparece.
  const canDelete = wardrobe?.user.role === 'user';

  const confirmDelete = async () => {
    if (!wardrobe) return;
    const accepted = await confirm({
      title: STRINGS.admin.deleteTitle,
      message: STRINGS.admin.deleteMessage(wardrobe.user.name),
      confirmLabel: STRINGS.admin.delete,
      tone: 'danger',
    });
    if (!accepted) return;
    try {
      await deleteUser(wardrobe.user.id);
      goBack();
    } catch (err) {
      setActionError((err as Error).message);
    }
  };

  return {
    wardrobe,
    isLoading,
    isRefreshing,
    error,
    actionError,
    onRefresh,
    tab,
    setTab,
    goBack,
    openPrivacy,
    canDelete,
    confirmDelete,
  };
}
