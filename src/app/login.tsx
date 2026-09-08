import { Link } from 'expo-router';
import { useForm } from 'react-hook-form';
import { Text, View } from 'react-native';
import { Button } from '../components/ui/Button';
import { FormField } from '../components/ui/FormField';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { useSession } from '../session/context';

/** Los datos que captura este formulario. */
type LoginForm = { email: string; password: string };

export default function LoginScreen() {
  const { signIn } = useSession();

  // `control` conecta los campos, `handleSubmit` valida antes de enviar y
  // `formState` trae los errores y si se está enviando en este momento.
  const { control, handleSubmit, setError, formState } = useForm<LoginForm>({
    defaultValues: { email: '', password: '' },
  });

  const submit = async ({ email, password }: LoginForm) => {
    try {
      await signIn(email, password);
      // No hay que navegar a mano: al cambiar la sesión, el layout raíz
      // muestra el armario automáticamente (ver src/app/_layout.tsx).
    } catch (error) {
      // `root` es el error del formulario completo (credenciales malas,
      // servidor apagado...), a diferencia del error de un campo puntual.
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
