import { Button } from '@/components/ui/Button';
import { FormError } from '@/components/ui/FormError';
import { FormField } from '@/components/ui/FormField';
import { FormScroll } from '@/components/ui/FormScroll';
import { PasswordField } from '@/components/ui/PasswordField';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Link } from 'expo-router';
import { Controller } from 'react-hook-form';
import { Text, View } from 'react-native';
import { useRegister } from './useRegister';

export default function RegisterScreen() {
  const { control, matchesPassword, onSubmit, isSubmitting, errorMessage } = useRegister();

  return (
    <View className="flex-1 bg-linen">
      <FormScroll contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 72, gap: 24 }}>
        <ScreenHeader title="Crea tu armario" subtitle="Guarda y organiza tus prendas" />

        <View className="gap-4">
          <FormField
            control={control}
            name="name"
            label="Nombre"
            autoCapitalize="words"
            placeholder="Tu nombre completo"
            maxLength={60}
            rules={{
              required: 'El nombre es obligatorio',
              minLength: { value: 2, message: 'Mínimo 2 caracteres' },
              maxLength: { value: 60, message: 'Máximo 60 caracteres' },
            }}
          />
          <FormField
            control={control}
            name="email"
            label="Correo"
            keyboardType="email-address"
            placeholder="tucorreo@ejemplo.com"
            maxLength={254}
            rules={{
              required: 'El correo es obligatorio',
              maxLength: { value: 254, message: 'Máximo 254 caracteres' },
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Correo inválido' },
            }}
          />
          <Controller
            control={control}
            name="password"
            rules={{
              required: 'La contraseña es obligatoria',
              minLength: { value: 8, message: 'Mínimo 8 caracteres' },
              maxLength: { value: 72, message: 'Máximo 72 caracteres' },
            }}
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <PasswordField
                label="Contraseña"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="••••••••"
                maxLength={72}
                error={error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="confirmation"
            rules={{ required: 'Confirma la contraseña', validate: matchesPassword }}
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <PasswordField
                label="Confirmar contraseña"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="••••••••"
                maxLength={72}
                error={error?.message}
              />
            )}
          />
        </View>

        <FormError message={errorMessage} />

        <View className="gap-3">
          <Button label={isSubmitting ? 'Creando…' : 'Crear cuenta'} onPress={onSubmit} disabled={isSubmitting} />
          {/* Privacidad: se informa ANTES de crear la cuenta, con enlace a la política. */}
          <Text className="font-body text-sm text-ink-muted text-center">
            Al crear tu cuenta aceptas la{' '}
            <Link href="/privacy" className="font-body-medium text-plum underline">
              Política de privacidad
            </Link>
          </Text>
        </View>

        <Link href="/login" className="font-body-medium text-plum text-center py-3">
          ¿Ya tienes cuenta? Inicia sesión
        </Link>
      </FormScroll>
    </View>
  );
}