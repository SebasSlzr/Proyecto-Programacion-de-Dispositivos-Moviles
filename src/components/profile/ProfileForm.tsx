import { Text } from 'react-native';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
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

      <TextField
        label="Nueva contraseña (opcional)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Déjalo vacío si no la quieres cambiar"
        maxLength={72}
      />

      {!!error && (
        <Text className="font-body text-sm text-red-500 bg-red-50 rounded-2xl p-3 text-center">
          {error}
        </Text>
      )}
      {!!success && (
        <Text className="font-body text-sm text-sage bg-sage/10 rounded-2xl p-3 text-center">
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
