import { Link } from 'expo-router';
import { useForm } from 'react-hook-form';
import { Text, View } from 'react-native';
import { Button } from '../src/components/ui/Button';
import { FormField } from '../src/components/ui/FormField';
import { ScreenHeader } from '../src/components/ui/ScreenHeader';
import { useSession } from '../src/session/context';

type LoginForm = { email: string; password: string };

export default function LoginScreen() {
  const { signIn } = useSession();
  const { control, handleSubmit, setError, formState } = useForm<LoginForm>({
    defaultValues: { email: '', password: '' },
  });

  const submit = async ({ email, password }: LoginForm) => {
    try {
      await signIn(email, password);
    } catch (error) {
      setError('root', { message: (error as Error).message });
    }
  };

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
          rules={{ required: 'La contraseña es obligatoria' }}
        />
      </View>

      {!!formState.errors.root && (
        <Text className="font-body text-sm text-red-500 bg-red-50 rounded-2xl p-3 text-center">
          {formState.errors.root.message}
        </Text>
      )}

      <Button
        label={formState.isSubmitting ? 'Entrando…' : 'Entrar'}
        onPress={handleSubmit(submit)}
        disabled={formState.isSubmitting}
      />

      <Link href="/register" className="font-body-medium text-plum text-center">
        ¿No tienes cuenta? Regístrate
      </Link>
    </View>
  );
}