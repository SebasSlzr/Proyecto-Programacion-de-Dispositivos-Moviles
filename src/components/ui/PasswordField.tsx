import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text, TextInput, View, type TextInputProps } from 'react-native';
import { STRINGS } from '@/constants/strings';
import { COLORS } from '@/constants/theme';

type PasswordFieldProps = Omit<TextInputProps, 'secureTextEntry'> & {
  label: string;
  error?: string | null;   // mensaje debajo del campo, por ejemplo "Las contraseñas no coinciden"
};

// Campo de contraseña con un ojito a la derecha para mostrarla u ocultarla.
// Mismo estilo que los demás campos de texto; solo guarda si se ve o no.
export function PasswordField({ label, error, ...input }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <View className="gap-1.5">
      <Text className="font-body-medium text-sm text-ink">{label}</Text>
      <View
        className={`min-h-12 flex-row items-center rounded-2xl border bg-ivory ${
          error ? 'border-danger-border' : 'border-taupe'
        }`}
      >
        <TextInput
          accessibilityLabel={label}
          secureTextEntry={!visible}
          autoCapitalize="none"
          autoCorrect={false}
          placeholderTextColor={COLORS.ink + '80'}
          className="flex-1 px-4 py-3 font-body text-ink"
          {...input}
        />
        <Pressable
          onPress={() => setVisible((current) => !current)}
          accessibilityRole="button"
          accessibilityLabel={visible ? STRINGS.passwordField.hide : STRINGS.passwordField.show}
          className="h-12 w-12 items-center justify-center"
        >
          <Ionicons name={visible ? 'eye-off' : 'eye'} size={22} color={COLORS.walnut} />
        </Pressable>
      </View>
      {!!error && <Text className="font-body text-xs text-danger">{error}</Text>}
    </View>
  );
}
