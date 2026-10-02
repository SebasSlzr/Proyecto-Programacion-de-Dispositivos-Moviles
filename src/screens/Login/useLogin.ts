import { useForm } from 'react-hook-form';
import { useSession } from '@/session/context';

export type LoginForm = { email: string; password: string };

// Estado del formulario de login y envío al backend.
export function useLogin() {
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

  return {
    control,
    onSubmit: handleSubmit(submit),
    isSubmitting: formState.isSubmitting,
    errorMessage: formState.errors.root?.message,
  };
}
