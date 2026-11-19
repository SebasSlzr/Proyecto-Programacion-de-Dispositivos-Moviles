import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text } from 'react-native';
import { STRINGS } from '@/constants/strings';
import { COLORS } from '@/constants/theme';

const TEXT = STRINGS.wishlistScreens;

type PurchasedToggleProps = {
  purchased: boolean;      // estado actual del deseo
  onToggle: () => void;    // el padre decide qué hacer (llamar a la API)
  disabled?: boolean;      // por ejemplo mientras se guarda el cambio
};

// Botón de dos estados para marcar un deseo como comprado o pendiente.
// El estado no depende solo del color: cambia el ícono y el texto.
export function PurchasedToggle({ purchased, onToggle, disabled = false }: PurchasedToggleProps) {
  return (
    <Pressable
      onPress={onToggle}
      disabled={disabled}
      accessibilityRole="switch"
      accessibilityState={{ checked: purchased, disabled }}
      accessibilityLabel={purchased ? TEXT.a11yPurchased : TEXT.a11yPending}
      className={`min-h-12 flex-row items-center justify-center gap-2 rounded-full px-5 border active:translate-y-px ${
        purchased ? 'bg-walnut border-walnut' : 'bg-ivory border-walnut'
      } ${disabled ? 'opacity-50' : ''}`}
      style={({ pressed }) => ({ opacity: disabled ? 0.5 : pressed ? 0.85 : 1 })}
    >
      <Ionicons
        name={purchased ? 'checkmark-circle' : 'ellipse-outline'}
        size={20}
        color={purchased ? COLORS.ivory : COLORS.walnut}
      />
      <Text className={`font-body-bold text-base ${purchased ? 'text-ivory' : 'text-walnut'}`}>
        {purchased ? TEXT.purchased : TEXT.markPurchased}
      </Text>
    </Pressable>
  );
}
