import { useLocalSearchParams } from 'expo-router';
import { PlaceholderScreen } from '@/components/ui/PlaceholderScreen';
import { STRINGS } from '@/constants/strings';

export default function AdminUserDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <PlaceholderScreen title={STRINGS.admin.userDetail} subtitle={`Usuario ${id}`} />;
}