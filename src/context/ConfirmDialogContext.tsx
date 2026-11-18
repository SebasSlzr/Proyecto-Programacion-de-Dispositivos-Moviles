import { createContext, use, type PropsWithChildren } from 'react';
import { Alert } from 'react-native';

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

// Implementación provisional con el diálogo del sistema. Daniel la reemplaza por el
// diálogo de madera sin cambiar la API: toda la app lo recibe sin tocar ninguna llamada.
const systemDialogs: ConfirmApi = {
  confirm: ({ title, message, confirmLabel = 'Confirmar', cancelLabel = 'Cancelar', tone = 'default' }) =>
    new Promise((resolve) =>
      Alert.alert(
        title,
        message,
        [
          { text: cancelLabel, style: 'cancel', onPress: () => resolve(false) },
          { text: confirmLabel, style: tone === 'danger' ? 'destructive' : 'default', onPress: () => resolve(true) },
        ],
        { cancelable: true, onDismiss: () => resolve(false) },
      ),
    ),
  alert: ({ title, message }) =>
    new Promise((resolve) =>
      Alert.alert(title, message, [{ text: 'Entendido', onPress: () => resolve() }], { onDismiss: () => resolve() }),
    ),
};

const ConfirmDialogContext = createContext<ConfirmApi>(systemDialogs);

export function ConfirmDialogProvider({ children }: PropsWithChildren) {
  return <ConfirmDialogContext value={systemDialogs}>{children}</ConfirmDialogContext>;
}

export function useConfirm(): ConfirmApi {
  return use(ConfirmDialogContext);
}