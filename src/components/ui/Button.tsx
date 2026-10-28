import { Pressable, Text } from 'react-native';
import { WoodPressable } from './WoodPressable';

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary'; // primary = placa de nogal, secondary = solo borde
  // Se usa mientras un formulario se está enviando (login/registro): baja la
  // opacidad y deja de responder al toque.
  disabled?: boolean;
};

export function Button({ label, onPress, variant = 'primary', disabled = false }: ButtonProps) {
  if (variant === 'primary') {
    return (
      <WoodPressable onPress={onPress} disabled={disabled} radius={999} className="py-3.5 px-6 items-center">
        <Text className="text-ivory font-body-bold text-base">{label}</Text>
      </WoodPressable>
    );
  }

  // Secundario: fondo ivory con borde y texto de nogal. Al presionarlo
  // (`active:`) se hunde 1 px y el fondo se oscurece un poco.
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      className={`bg-ivory border border-walnut rounded-full py-3.5 px-6 items-center active:bg-linen active:translate-y-px ${
        disabled ? 'opacity-50' : ''
      }`}
    >
      <Text className="text-walnut font-body-bold text-base">{label}</Text>
    </Pressable>
  );
}
