import { ScrollView } from 'react-native';
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

export function ProfileDrawerContent({ navigation }: ProfileDrawerContentProps) {
  const insets = useSafeAreaInsets();
  const { user } = useSession();

  if (!user) return null;

  return (
    <ScrollView
      className="flex-1 bg-linen"
      contentContainerStyle={{ padding: 20, paddingTop: insets.top + 20, gap: 20 }}
      keyboardShouldPersistTaps="handled"
    >
      <ProfileHeader onClose={() => navigation.closeDrawer()} />
      <ProfileForm user={user} />
      <AccountActions bottomInset={insets.bottom} />
    </ScrollView>
  );
}
