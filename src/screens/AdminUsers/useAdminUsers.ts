import { useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { deleteUser, listUsers } from '@/api/admin';
import { useFocusFetch } from '@/hooks/useFocusFetch';
import type { AdminUser } from '@/types';

// Declarada fuera del hook para que su identidad sea estable (ver useFocusFetch).
const fetchUsers = () => listUsers().then((response) => response.users);

export function useAdminUsers() {
  const { data: users, isLoading, isRefreshing, error, onRefresh } = useFocusFetch<AdminUser[]>(fetchUsers, []);
  const [search, setSearch] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);

  const filteredUsers = useMemo(() => {
    const text = search.toLowerCase();
    return users.filter(
      (user) => user.name.toLowerCase().includes(text) || user.email.toLowerCase().includes(text)
    );
  }, [users, search]);

  const totals = useMemo(
    () => ({
      users: users.length,
      garments: users.reduce((sum, user) => sum + user.garmentCount, 0),
      outfits: users.reduce((sum, user) => sum + user.outfitCount, 0),
    }),
    [users]
  );

  const confirmDelete = (target: AdminUser) => {
    Alert.alert(
      'Eliminar usuario',
      `Se van a borrar la cuenta de ${target.name}, sus prendas y sus outfits. Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteUser(target.id);
              setActionError(null);
              await onRefresh();
            } catch (err) {
              setActionError((err as Error).message);
            }
          },
        },
      ]
    );
  };

  return {
    filteredUsers,
    totals,
    search,
    setSearch,
    isLoading,
    isRefreshing,
    error,
    actionError,
    onRefresh,
    confirmDelete,
  };
}