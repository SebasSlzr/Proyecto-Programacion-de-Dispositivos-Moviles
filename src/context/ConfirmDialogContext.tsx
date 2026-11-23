import { createContext, use, useRef, useState, type PropsWithChildren } from 'react';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { STRINGS } from '@/constants/strings';

export type ConfirmOptions = {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'danger' | 'default';
};

type ConfirmApi = {
  confirm: (options: ConfirmOptions) => Promise<boolean>;                     // true si confirma
  alert: (options: { title: string; message: string }) => Promise<void>;      // aviso con un botón
};

// Lo que se está mostrando ahora: las opciones y si es confirmación o aviso.
type OpenDialog = { kind: 'confirm'; options: ConfirmOptions } | { kind: 'alert'; options: ConfirmOptions };

const ConfirmDialogContext = createContext<ConfirmApi | null>(null);

// Un solo diálogo para toda la app. confirm() y alert() devuelven una promesa que se
// resuelve cuando la persona responde, así se usan con await igual que antes con el diálogo del sistema.
export function ConfirmDialogProvider({ children }: PropsWithChildren) {
  const [open, setOpen] = useState<OpenDialog | null>(null);
  // Guarda cómo avisarle al que llamó. useRef porque cambiarlo no debe redibujar nada.
  const resolveRef = useRef<((accepted: boolean) => void) | null>(null);

  const show = (dialog: OpenDialog) =>
    new Promise<boolean>((resolve) => {
      resolveRef.current?.(false);   // si había otro abierto, cuenta como cancelado
      resolveRef.current = resolve;
      setOpen(dialog);
    });

  const answer = (accepted: boolean) => {
    resolveRef.current?.(accepted);
    resolveRef.current = null;
    setOpen(null);
  };

  const api: ConfirmApi = {
    confirm: (options) => show({ kind: 'confirm', options }),
    alert: async (options) => {
      await show({ kind: 'alert', options });
    },
  };

  const options = open?.options;
  const isAlert = open?.kind === 'alert';

  return (
    <ConfirmDialogContext value={api}>
      {children}
      <ConfirmDialog
        visible={!!open}
        title={options?.title ?? ''}
        message={options?.message ?? ''}
        confirmLabel={isAlert ? STRINGS.dialogs.ok : (options?.confirmLabel ?? STRINGS.dialogs.confirm)}
        cancelLabel={isAlert ? undefined : (options?.cancelLabel ?? STRINGS.dialogs.cancel)}
        tone={isAlert ? 'default' : options?.tone}
        onConfirm={() => answer(true)}
        onCancel={() => answer(false)}
      />
    </ConfirmDialogContext>
  );
}

export function useConfirm(): ConfirmApi {
  const api = use(ConfirmDialogContext);
  if (!api) throw new Error('useConfirm debe usarse dentro de ConfirmDialogProvider');
  return api;
}
