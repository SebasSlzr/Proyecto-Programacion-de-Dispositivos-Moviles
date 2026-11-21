import { useConfirm } from '@/context/ConfirmDialogContext';

type ConfirmActionOptions = {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void | Promise<void>;
};

// Atajo para confirmar una acción que borra algo. Ahora usa el diálogo propio de la app
// (useConfirm) en lugar del diálogo del sistema; quien lo llama no tiene que cambiar nada.
export function useConfirmAction() {
  const { confirm: ask } = useConfirm();

  const confirm = async ({ title, message, confirmLabel = 'Eliminar', onConfirm }: ConfirmActionOptions) => {
    const accepted = await ask({ title, message, confirmLabel, tone: 'danger' });
    if (accepted) await onConfirm();
  };

  return { confirm };
}
