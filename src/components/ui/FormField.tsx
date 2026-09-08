import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
  type RegisterOptions,
} from 'react-hook-form';
import { Text, TextInput, View, type TextInputProps } from 'react-native';
import { COLORS } from '../../constants/theme';

// Hereda las props de TextInput (keyboardType, secureTextEntry...) y les
// suma las que necesita para conectarse al formulario.
type FormFieldProps<T extends FieldValues> = TextInputProps & {
  control: Control<T>;
  /** Nombre del campo dentro del formulario. TypeScript solo acepta los que existen. */
  name: Path<T>;
  label: string;
  /** Reglas de validación: required, minLength, pattern, validate... */
  rules?: RegisterOptions<T, Path<T>>;
};

// Mismo patrón que los demás componentes de `ui/`: sin lógica de negocio,
// solo presentación. `Controller` es el puente entre react-hook-form y un
// TextInput de React Native — evita un `useState` por cada campo.
export function FormField<T extends FieldValues>({
  control,
  name,
  label,
  rules,
  ...input
}: FormFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View className="gap-1.5">
          <Text className="font-body-medium text-ink text-sm">{label}</Text>
          <TextInput
            className={`bg-ivory border rounded-2xl px-4 py-3 font-body text-ink ${
              error ? 'border-red-400' : 'border-taupe'
            }`}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            autoCapitalize="none"
            placeholderTextColor={COLORS.ink + '80'}
            {...input}
          />
          {/* El mensaje sale de las `rules`: quien define la regla define el texto. */}
          {!!error && <Text className="font-body text-xs text-red-500">{error.message}</Text>}
        </View>
      )}
    />
  );
}
