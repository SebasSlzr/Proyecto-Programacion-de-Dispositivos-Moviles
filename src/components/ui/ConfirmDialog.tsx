import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { FullWindowOverlay } from 'react-native-screens';
import { COLORS } from '@/constants/theme';

type ConfirmDialogProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;            // sin cancelLabel es un aviso: solo aparece un botón
  tone?: 'danger' | 'default';     // danger = acción que no se puede deshacer
  onConfirm: () => void;
  onCancel: () => void;
};

// Diálogo con el estilo de Percha en lugar del cuadro gris del sistema:
// fondo oscuro semitransparente y una tarjeta ivory en el centro.
// Tocar fuera de la tarjeta o el botón atrás de Android cuenta como Cancelar.
export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel,
  tone = 'default',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const confirmClass = tone === 'danger' ? 'bg-danger' : 'bg-walnut';

  // Fondo oscuro: al tocarlo se cancela.
  const content = (
    <Pressable
      onPress={onCancel}
      accessibilityRole="button"
      accessibilityLabel={cancelLabel ?? confirmLabel}
      className="flex-1 items-center justify-center px-8"
      style={{ backgroundColor: COLORS.overlay }}
    >
      {/* La tarjeta captura el toque para que tocar dentro no cierre el diálogo. */}
      <Pressable
        onPress={() => {}}
        accessible={false}
        className="w-full max-w-sm gap-3 rounded-3xl border border-taupe bg-ivory p-6 shadow-lg"
      >
        <Text accessibilityRole="header" className="font-display text-xl text-ink">
          {title}
        </Text>
        <Text className="font-body text-base text-ink-muted">{message}</Text>

        <View className="mt-3 flex-row justify-end gap-3">
          {cancelLabel && (
            <Pressable
              onPress={onCancel}
              accessibilityRole="button"
              className="min-h-12 items-center justify-center rounded-full border border-walnut px-5 active:bg-linen"
            >
              <Text className="font-body-bold text-base text-walnut">{cancelLabel}</Text>
            </Pressable>
          )}
          <Pressable
            onPress={onConfirm}
            accessibilityRole="button"
            className={`min-h-12 items-center justify-center rounded-full px-5 active:opacity-85 ${confirmClass}`}
          >
            <Text className="font-body-bold text-base text-ivory">{confirmLabel}</Text>
          </Pressable>
        </View>
      </Pressable>
    </Pressable>
  );

  // iOS: las pantallas de detalle (deseo, prenda, outfit) se abren como modal nativo, y un <Modal>
  // de React Native abierto desde la raíz de la app queda DEBAJO de ellas: el diálogo no se ve y
  // confirm() nunca responde. FullWindowOverlay lo dibuja por encima de todas las pantallas.
  if (Platform.OS === 'ios') {
    if (!visible) return null;
    return (
      <FullWindowOverlay>
        <View style={StyleSheet.absoluteFill}>{content}</View>
      </FullWindowOverlay>
    );
  }

  // Android: el <Modal> ya se muestra encima de todo y maneja el botón atrás (cuenta como Cancelar).
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onCancel}>
      {content}
    </Modal>
  );
}
