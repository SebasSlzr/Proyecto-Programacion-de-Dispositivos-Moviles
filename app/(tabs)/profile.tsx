import { useState } from 'react';
import { View, Text, TextInput, ScrollView, Alert, Pressable } from 'react-native';
import { ScreenHeader } from '../../src/components/ui/ScreenHeader';
import { Button } from '../../src/components/ui/Button';
import { useSession } from '../../src/session/context';
import { updateMe, deleteMe } from '../../src/api/users';
import { COLORS } from '../../src/constants/theme';

export default function ProfileScreen() {
  const { user, signOut, updateUser } = useSession();

  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!user) return null; // Stack.Protected ya garantiza que esto no se vea sin sesión.

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

  const confirmDeleteAccount = () => {
    Alert.alert(
      'Eliminar cuenta',
      'Se van a borrar tu cuenta, tus prendas y tus outfits. Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar cuenta',
          style: 'destructive',
          onPress: async () => {
            await deleteMe();
            signOut();
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      className="flex-1 bg-linen"
      contentContainerStyle={{ padding: 20, paddingTop: 60, gap: 20 }}
      keyboardShouldPersistTaps="handled"
    >
      <ScreenHeader title="Tu perfil" subtitle="Administra tu cuenta" />

      <View className="gap-1.5">
        <Text className="font-body-medium text-ink text-sm">Nombre</Text>
        <TextInput
          className="font-body bg-ivory rounded-2xl px-4 py-3 text-ink border border-taupe"
          value={name}
          onChangeText={setName}
          maxLength={60}
        />
      </View>

      <View className="gap-1.5">
        <Text className="font-body-medium text-ink text-sm">Correo</Text>
        <TextInput
          className="font-body bg-ivory rounded-2xl px-4 py-3 text-ink border border-taupe"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          maxLength={254}
        />
      </View>

      <View className="gap-1.5">
        <Text className="font-body-medium text-ink text-sm">Nueva contraseña (opcional)</Text>
        <TextInput
          className="font-body bg-ivory rounded-2xl px-4 py-3 text-ink border border-taupe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Déjalo vacío si no la quieres cambiar"
          placeholderTextColor={COLORS.ink + '80'}
          maxLength={72}
        />
      </View>

      {!!error && (
        <Text className="font-body text-sm text-red-500 bg-red-50 rounded-2xl p-3 text-center">{error}</Text>
      )}
      {!!success && (
        <Text className="font-body text-sm text-sage bg-sage/10 rounded-2xl p-3 text-center">{success}</Text>
      )}

      <Button label={isSubmitting ? 'Guardando…' : 'Guardar cambios'} onPress={saveChanges} disabled={isSubmitting} />

      <View className="border-t border-taupe pt-6 gap-3 mt-4">
        <Button label="Cerrar sesión" variant="secondary" onPress={signOut} />
        <Pressable onPress={confirmDeleteAccount} className="rounded-full py-3 px-6 items-center border border-red-300 bg-red-50">
          <Text className="font-body-bold text-red-500 text-base">Eliminar cuenta</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}