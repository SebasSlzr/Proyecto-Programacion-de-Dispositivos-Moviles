import { useForm } from 'react-hook-form';
import { useSession } from '@/session/context';

export type RegisterForm = { name: string; email: string; password: string; confirmation: string };

// Estado del formulario de registro y creación de la cuenta en el backend.
export function useRegister() {
  const { signUp } = useSession();
  const { control, handleSubmit, setError, getValues, formState } = useForm<RegisterForm>({
    defaultValues: { name: '', email: '', password: '', confirmation: '' },
  });

  const submit = async ({ name, email, password }: RegisterForm) => {
    try {
      await signUp(name, email, password);
    } catch (error) {
      setError('root', { message: (error as Error).message });
    }
  };

  const matchesPassword = (value: string) => value === getValues('password') || 'Las contraseñas no coinciden';

  return {
    control,
    matchesPassword,
    onSubmit: handleSubmit(submit),
    isSubmitting: formState.isSubmitting,
    errorMessage: formState.errors.root?.message,
  };
}
