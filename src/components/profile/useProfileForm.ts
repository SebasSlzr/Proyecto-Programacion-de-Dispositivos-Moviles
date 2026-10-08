import { useState } from 'react';
import { updateMe } from '@/api/users';
import { useSession } from '@/session/context';
import type { User } from '@/types';

export function useProfileForm(user: User) {
  const { updateUser } = useSession();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const saveChanges = async () => {
    setError(null);
    setSuccess(null);

    const changes: { name?: string; email?: string; password?: string } = {};
    if (name.trim() !== user.name) changes.name = name.trim();
    if (email.trim().toLowerCase() !== user.email) changes.email = email.trim().toLowerCase();
    if (password.length > 0) changes.password = password;

    if (Object.keys(changes).length === 0) {
      setError('No hiciste ningún cambio');
      return;
    }

    setIsSubmitting(true);
    try {
      const { user: updated } = await updateMe(changes);
      updateUser(updated);
      setPassword('');
      setSuccess('Perfil actualizado');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    isSubmitting,
    error,
    success,
    saveChanges,
  };
}
