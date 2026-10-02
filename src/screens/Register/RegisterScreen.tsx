import { Link } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { FormError } from '@/components/ui/FormError';
import { FormField } from '@/components/ui/FormField';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useRegister } from './useRegister';

export default function RegisterScreen() {
  const { control, matchesPassword, onSubmit, isSubmitting, errorMessage } = useRegister();

  return (
    <ScrollView
      className="flex-1 bg-linen"
      contentContainerStyle={{ padding: 24, paddingTop: 72, gap: 24 }}
      keyboardShouldPersistTaps="handled"
    >
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
        <FormField
          control={control}
          name="password"
          label="Contraseña"
          secureTextEntry
          placeholder="••••••••"
          maxLength={72}
          rules={{
            required: 'La contraseña es obligatoria',
            minLength: { value: 8, message: 'Mínimo 8 caracteres' },
            maxLength: { value: 72, message: 'Máximo 72 caracteres' },
          }}
        />
        <FormField
          control={control}
          name="confirmation"
          label="Confirmar contraseña"
          secureTextEntry
          placeholder="••••••••"
          maxLength={72}
          rules={{ required: 'Confirma la contraseña', validate: matchesPassword }}
        />
      </View>

      <FormError message={errorMessage} />

      <Button label={isSubmitting ? 'Creando…' : 'Crear cuenta'} onPress={onSubmit} disabled={isSubmitting} />

      <Link href="/login" className="font-body-medium text-plum text-center">
        ¿Ya tienes cuenta? Inicia sesión
      </Link>
    </ScrollView>
  );
}
