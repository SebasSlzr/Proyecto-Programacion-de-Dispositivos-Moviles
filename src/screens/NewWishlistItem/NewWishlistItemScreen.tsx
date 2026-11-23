import { View } from 'react-native';
import { ModalHeader } from '@/components/ui/ModalHeader';
import { WishlistForm } from '@/components/wishlist/WishlistForm';
import { STRINGS } from '@/constants/strings';
import { useNewWishlistItem } from './useNewWishlistItem';

export default function NewWishlistItemScreen() {
  const { saveWish } = useNewWishlistItem();

  return (
    <View className="flex-1 bg-linen">
      <ModalHeader title={STRINGS.titles.newWish} subtitle={STRINGS.wishlistScreens.newSubtitle} />
      <WishlistForm submitLabel={STRINGS.wishlistScreens.saveNew} onSubmit={saveWish} />
    </View>
  );
}
