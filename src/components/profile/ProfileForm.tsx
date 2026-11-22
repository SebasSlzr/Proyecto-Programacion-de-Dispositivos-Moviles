import { Text } from 'react-native';
import { Button } from '@/components/ui/Button';
import { PasswordField } from '@/components/ui/PasswordField';
import { TextField } from '@/components/ui/TextField';
import { STRINGS } from '@/constants/strings';
import type { User } from '@/types';
import { useProfileForm } from './useProfileForm';

type ProfileFormProps = {
  user: User;
};

export function ProfileForm({ user }: ProfileFormProps) {
  const {
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
  } = useProfileForm(user);

  return (
    <>
      <TextField label="Nombre" value={name} onChangeText={setName} maxLength={60} />

      <TextField
        label="Correo"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        maxLength={254}
      />

      <PasswordField
        label={STRINGS.passwordField.newLabel}
        value={password}
        onChangeText={setPassword}
        placeholder={STRINGS.passwordField.newPlaceholder}
        maxLength={72}
        error={passwordError}
      />

      <PasswordField
        label={STRINGS.passwordField.confirmLabel}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder={STRINGS.passwordField.confirmPlaceholder}
        maxLength={72}
        error={confirmError}
      />

      {!!error && (
        <Text className="font-body text-sm text-danger bg-danger-soft rounded-2xl p-3 text-center">
          {error}
        </Text>
      )}
      {!!success && (
        <Text className="font-body text-sm text-sage-dark bg-sage/10 rounded-2xl p-3 text-center">
          {success}
        </Text>
      )}

      <Button
        label={isSubmitting ? 'Guardando…' : 'Guardar cambios'}
        onPress={saveChanges}
        disabled={isSubmitting}
      />
    </>
  );
}
