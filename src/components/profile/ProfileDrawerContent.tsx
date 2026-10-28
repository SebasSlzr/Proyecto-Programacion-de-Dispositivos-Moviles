import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSession } from '@/session/context';
import { AccountActions } from './AccountActions';
import { ProfileForm } from './ProfileForm';
import { ProfileHeader } from './ProfileHeader';

type ProfileDrawerContentProps = {
  navigation: {
    closeDrawer: () => void;
  };
};

// Contenido del drawer: encabezado de madera fijo arriba, y debajo
// los datos de la cuenta en una tarjeta ivory y las acciones de la cuenta.
export function ProfileDrawerContent({ navigation }: ProfileDrawerContentProps) {
  const insets = useSafeAreaInsets();
  const { user } = useSession();

  if (!user) return null;

  return (
    <View className="flex-1 bg-linen">
      <ProfileHeader onClose={() => navigation.closeDrawer()} />

      <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }} keyboardShouldPersistTaps="handled">
        <View className="bg-ivory rounded-2xl p-4 gap-4 shadow-sm border border-taupe">
          <ProfileForm user={user} />
        </View>
        <AccountActions bottomInset={insets.bottom} />
      </ScrollView>
    </View>
  );
}