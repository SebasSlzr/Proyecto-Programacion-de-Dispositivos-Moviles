import { useLocalSearchParams } from 'expo-router';
import { PlaceholderScreen } from '@/components/ui/PlaceholderScreen';
import { STRINGS } from '@/constants/strings';

export default function EditWishlistItemScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <PlaceholderScreen title={STRINGS.titles.editWish} subtitle={`Deseo ${id}`} />;
}