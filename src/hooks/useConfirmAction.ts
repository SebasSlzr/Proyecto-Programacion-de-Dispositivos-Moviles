import { Alert } from 'react-native';

type ConfirmActionOptions = {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void | Promise<void>;
};

export function useConfirmAction() {
  const confirm = ({
    title,
    message,
    confirmLabel = 'Eliminar',
    onConfirm,
  }: ConfirmActionOptions) => {
    Alert.alert(title, message, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: confirmLabel,
        style: 'destructive',
        onPress: () => {
          void onConfirm();
        },
      },
    ]);
  };

  return { confirm };
}
