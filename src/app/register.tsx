import { Link } from 'expo-router';
import { useForm } from 'react-hook-form';
import { ScrollView, Text, View } from 'react-native';
import { Button } from '../components/ui/Button';
import { FormField } from '../components/ui/FormField';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { useSession } from '../session/context';

type RegisterForm = { name: string; email: string; password: string; confirmation: string };

export default function RegisterScreen() {
  const { signUp } = useSession();
  const { control, handleSubmit, setError, getValues, formState } = useForm<RegisterForm>({
    defaultValues: { name: '', email: '', password: '', confirmation: '' },
  });

  // `confirmation` no se envía al backend: solo sirve para revisar que no
  // hubo una errata al escribir la contraseña.
  const submit = async ({ name, email, password }: RegisterForm) => {
    try {
      await signUp(name, email, password);
    } catch (error) {
      setError('root', { message: (error as Error).message });
    }
  };

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
          rules={{
            required: 'El nombre es obligatorio',
            minLength: { value: 2, message: 'Mínimo 2 caracteres' },
          }}
        />
        <FormField
          control={control}
          name="email"
          label="Correo"
          keyboardType="email-address"
          placeholder="tucorreo@ejemplo.com"
          rules={{
            required: 'El correo es obligatorio',
            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Correo inválido' },
          }}
        />
        <FormField
          control={control}
          name="password"
          label="Contraseña"
          secureTextEntry
          placeholder="••••••••"
          rules={{
            required: 'La contraseña es obligatoria',
            // 8 caracteres, igual que exige el backend guía: si aquí se
            // pidiera menos, el servidor rechazaría el registro y la persona
            // no entendería por qué.
            minLength: { value: 8, message: 'Mínimo 8 caracteres' },
          }}
        />
        <FormField
          control={control}
          name="confirmation"
          label="Confirmar contraseña"
          secureTextEntry
          placeholder="••••••••"
          rules={{
            required: 'Confirma la contraseña',
            validate: (value) => value === getValues('password') || 'Las contraseñas no coinciden',
          }}
        />
      </View>

      {!!formState.errors.root && (
        <Text className="font-body text-sm text-red-500 bg-red-50 rounded-2xl p-3 text-center">
          {formState.errors.root.message}
        </Text>
      )}

      <Button
        label={formState.isSubmitting ? 'Creando…' : 'Crear cuenta'}
        onPress={handleSubmit(submit)}
        disabled={formState.isSubmitting}
      />

      <Link href="/login" className="font-body-medium text-plum text-center">
        ¿Ya tienes cuenta? Inicia sesión
      </Link>
    </ScrollView>
  );
}
