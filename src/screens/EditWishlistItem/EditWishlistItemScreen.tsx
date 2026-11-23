import { View } from 'react-native';
import { ListStatus } from '@/components/ui/ListStatus';
import { ModalHeader } from '@/components/ui/ModalHeader';
import { WishlistDetail } from '@/components/wishlist/WishlistDetail';
import { WishlistForm } from '@/components/wishlist/WishlistForm';
import { STRINGS } from '@/constants/strings';
import { useWishlistDetail } from './useWishlistDetail';

const TEXT = STRINGS.wishlistScreens;

// /wishlist/[id]: muestra el deseo y, al tocar "Editar", el mismo formulario de crear con sus datos.
export default function EditWishlistItemScreen() {
  const detail = useWishlistDetail();
  const { item } = detail;

  if (!item) {
    return (
      <View className="flex-1 bg-linen">
        <ModalHeader title={TEXT.detailFallbackTitle} onClose={detail.close} />
        <ListStatus
          isLoading={detail.isLoading}
          error={detail.loadError}
          isEmpty={false}
          emptyTitle=""
          emptyDescription=""
        />
      </View>
    );
  }

  if (detail.isEditing) {
    return (
      <View className="flex-1 bg-linen">
        <ModalHeader title={STRINGS.titles.editWish} subtitle={TEXT.editSubtitle} onClose={detail.stopEditing} />
        <WishlistForm initialValues={item} submitLabel={STRINGS.actions.save} onSubmit={detail.saveChanges} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-linen">
      <ModalHeader title={item.name} subtitle={item.store ?? undefined} onClose={detail.close} onDelete={detail.confirmDelete} />
      <WishlistDetail
        item={item}
        isBusy={detail.isBusy}
        error={detail.actionError}
        canMove={detail.canMove}
        moveHint={detail.moveHint}
        onTogglePurchased={detail.togglePurchased}
        onOpenLink={detail.openLink}
        onMoveToWardrobe={detail.moveToWardrobe}
        onEdit={detail.startEditing}
      />
    </View>
  );
}
