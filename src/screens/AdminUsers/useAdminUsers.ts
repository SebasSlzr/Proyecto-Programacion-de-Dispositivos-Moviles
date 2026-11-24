import { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { useConfirm } from '@/context/ConfirmDialogContext';
import { deleteUser, listUsers } from '@/api/admin';
import { STRINGS } from '@/constants/strings';
import { useFocusFetch } from '@/hooks/useFocusFetch';
import type { AdminUser } from '@/types';

// Declarada fuera del hook para que su identidad sea estable (ver useFocusFetch).
const fetchUsers = () => listUsers().then((response) => response.users);

export type UserSection = { title: string; data: AdminUser[] };

// Lógica del panel de usuarios: carga la lista con listUsers (sin endpoints nuevos),
// la filtra por nombre o correo, la separa en "Administradores" y "Usuarios",
// calcula los totales y maneja abrir el detalle y eliminar con el diálogo propio.
export function useAdminUsers() {
  const router = useRouter();
  const { data: users, isLoading, isRefreshing, error, onRefresh } = useFocusFetch<AdminUser[]>(fetchUsers, []);
  const [search, setSearch] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);
  const { confirm } = useConfirm();

  // Secciones para SectionList: primero administradores y luego usuarios, cada una
  // en orden alfabético. Una sección sin nadie (por la búsqueda) no se muestra.
  const sections = useMemo<UserSection[]>(() => {
    const text = search.toLowerCase();
    const matches = users
      .filter((user) => user.name.toLowerCase().includes(text) || user.email.toLowerCase().includes(text))
      .sort((a, b) => a.name.localeCompare(b.name, 'es'));

    return [
      { title: STRINGS.admin.sectionAdmins, data: matches.filter((user) => user.role === 'admin') },
      { title: STRINGS.admin.sectionUsers, data: matches.filter((user) => user.role === 'user') },
    ].filter((section) => section.data.length > 0);
  }, [users, search]);

  const totals = useMemo(
    () => ({
      users: users.length,
      garments: users.reduce((sum, user) => sum + user.garmentCount, 0),
      outfits: users.reduce((sum, user) => sum + user.outfitCount, 0),
    }),
    [users]
  );

  // El detalle solo recibe el id (contrato 6.5) y carga lo demás con getUserWardrobe.
  const openUser = (user: AdminUser) => router.push({ pathname: '/user/[id]', params: { id: user.id } });

  const confirmDelete = async (target: AdminUser) => {
    const accepted = await confirm({
      title: STRINGS.admin.deleteTitle,
      message: STRINGS.admin.deleteMessage(target.name),
      confirmLabel: STRINGS.admin.delete,
      tone: 'danger',
    });
    if (!accepted) return;
    try {
      await deleteUser(target.id);
      setActionError(null);
      await onRefresh();
    } catch (err) {
      setActionError((err as Error).message);
    }
  };

  return {
    sections,
    totals,
    search,
    setSearch,
    isLoading,
    isRefreshing,
    error,
    actionError,
    onRefresh,
    openUser,
    confirmDelete,
  };
}
