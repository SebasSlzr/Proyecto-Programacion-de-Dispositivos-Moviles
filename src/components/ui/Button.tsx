import { Pressable, Text } from 'react-native';

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary'; // primary = relleno, secondary = solo borde
  // Se usa mientras un formulario se está enviando (login/registro): baja la
  // opacidad y deja de responder al toque.
  disabled?: boolean;
};

export function Button({ label, onPress, variant = 'primary', disabled = false }: ButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      // El feedback al presionar se hace con `style` (baja la opacidad),
      // porque NativeWind no soporta className condicional sobre el estado
      // "pressed" de Pressable de forma directa.
      style={({ pressed }) => ({ opacity: disabled ? 0.5 : pressed ? 0.85 : 1 })}
      className={
        isPrimary
          ? 'bg-plum rounded-full py-3 px-6 items-center'
          : 'bg-transparent border border-plum rounded-full py-3 px-6 items-center'
      }
    >
      <Text className={isPrimary ? 'text-ivory font-body-bold text-base' : 'text-plum font-body-bold text-base'}>
        {label}
      </Text>
    </Pressable>
  );
}