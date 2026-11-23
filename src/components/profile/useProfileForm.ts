import { useState } from 'react';
import { updateMe } from '@/api/users';
import { STRINGS } from '@/constants/strings';
import { useConfirm } from '@/context/ConfirmDialogContext';
import { useSession } from '@/session/context';
import type { User } from '@/types';

const TEXT = STRINGS.passwordField;

export function useProfileForm(user: User) {
  const { updateUser } = useSession();
  const { confirm, alert } = useConfirm();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPasswordValue] = useState('');
  const [confirmPassword, setConfirmValue] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Al escribir de nuevo se borra el error del campo, para no regañar mientras se corrige.
  const setPassword = (value: string) => {
    setPasswordValue(value);
    setPasswordError(null);
  };
  const setConfirmPassword = (value: string) => {
    setConfirmValue(value);
    setConfirmError(null);
  };

  // Mismas reglas que en el registro: mínimo 8 caracteres y las dos deben coincidir.
  // Si algo falla, el error sale debajo del campo y no se envía nada.
  const validatePassword = () => {
    if (password.length === 0 && confirmPassword.length === 0) return true;
    let valid = true;
    if (password.length < 8) {
      setPasswordError(TEXT.minLength);
      valid = false;
    }
    if (confirmPassword !== password) {
      setConfirmError(TEXT.mismatch);
      valid = false;
    }
    return valid;
  };

  const saveChanges = async () => {
    setError(null);
    setSuccess(null);
    if (!validatePassword()) return;

    const changes: { name?: string; email?: string; password?: string } = {};
    if (name.trim() !== user.name) changes.name = name.trim();
    if (email.trim().toLowerCase() !== user.email) changes.email = email.trim().toLowerCase();
    if (password.length > 0) changes.password = password;

    if (Object.keys(changes).length === 0) {
      setError('No hiciste ningún cambio');
      return;
    }

    // Cambiar la contraseña pide confirmación con el diálogo propio de la app.
    if (changes.password) {
      const accepted = await confirm({
        title: TEXT.confirmTitle,
        message: TEXT.confirmMessage,
        confirmLabel: TEXT.confirmAction,
      });
      if (!accepted) return;
    }

    setIsSubmitting(true);
    try {
      const { user: updated } = await updateMe(changes);
      updateUser(updated);
      setPasswordValue('');
      setConfirmValue('');
      setSuccess('Perfil actualizado');
      if (changes.password) await alert({ title: TEXT.updatedTitle, message: TEXT.updatedMessage });
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
    confirmPassword,
    setConfirmPassword,
    passwordError,
    confirmError,
    isSubmitting,
    error,
    success,
    saveChanges,
  };
}
