import { deleteMe } from '@/api/users';
import { useConfirmAction } from '@/hooks/useConfirmAction';
import { useSession } from '@/session/context';

export function useDeleteAccount() {
  const { signOut } = useSession();
  const { confirm } = useConfirmAction();

  const confirmDeleteAccount = () => {
    confirm({
      title: 'Eliminar cuenta',
      message:
        'Se van a borrar tu cuenta, tus prendas y tus outfits. Esta acción no se puede deshacer.',
      confirmLabel: 'Eliminar cuenta',
      onConfirm: async () => {
        await deleteMe();
        signOut();
      },
    });
  };

  return { confirmDeleteAccount };
}
