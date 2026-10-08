import { Text, Pressable, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { useSession } from '@/session/context';
import { useDeleteAccount } from './useDeleteAccount';

type AccountActionsProps = {
  bottomInset: number;
};

export function AccountActions({ bottomInset }: AccountActionsProps) {
  const { signOut } = useSession();
  const { confirmDeleteAccount } = useDeleteAccount();

  return (
    <View
      className="border-t border-taupe pt-6 gap-3 mt-4"
      style={{ paddingBottom: bottomInset + 20 }}
    >
      <Button label="Cerrar sesión" variant="secondary" onPress={signOut} />
      <Pressable
        onPress={confirmDeleteAccount}
        className="rounded-full py-3 px-6 items-center border border-red-300 bg-red-50"
      >
        <Text className="font-body-bold text-red-500 text-base">Eliminar cuenta</Text>
      </Pressable>
    </View>
  );
}
