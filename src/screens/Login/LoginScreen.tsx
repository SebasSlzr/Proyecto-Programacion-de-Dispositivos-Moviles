import { Link } from 'expo-router';
import { View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { FormError } from '@/components/ui/FormError';
import { FormField } from '@/components/ui/FormField';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useLogin } from './useLogin';

export default function LoginScreen() {
  const { control, onSubmit, isSubmitting, errorMessage } = useLogin();

  return (
    <View className="flex-1 bg-linen justify-center px-6 gap-6">
      <ScreenHeader title="Bienvenida de vuelta" subtitle="Entra para ver tu armario" />

      <View className="gap-4">
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
        <FormField
          control={control}
          name="password"
          label="Contraseña"
          secureTextEntry
          placeholder="••••••••"
          maxLength={72}
          rules={{
            required: 'La contraseña es obligatoria',
            maxLength: { value: 72, message: 'Máximo 72 caracteres' },
          }}
        />
      </View>

      <FormError message={errorMessage} />

      <Button label={isSubmitting ? 'Entrando…' : 'Entrar'} onPress={onSubmit} disabled={isSubmitting} />

      <Link href="/register" className="font-body-medium text-plum text-center">
        ¿No tienes cuenta? Regístrate
      </Link>
    </View>
  );
}
