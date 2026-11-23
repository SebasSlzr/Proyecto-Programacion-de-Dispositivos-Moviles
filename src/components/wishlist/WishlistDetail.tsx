import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { GarmentImage } from '@/components/ui/GarmentImage';
import { WishOutfitMatches } from '@/components/outfits/WishOutfitMatches';
import { STRINGS } from '@/constants/strings';
import { COLORS } from '@/constants/theme';
import type { WishlistItem } from '@/types';
import { formatPrice } from './formatPrice';
import { PurchasedToggle } from './PurchasedToggle';

const TEXT = STRINGS.wishlistScreens;

type WishlistDetailProps = {
  item: WishlistItem;
  isBusy: boolean;
  error: string | null;
  canMove: boolean;
  moveHint: string | null;     // por qué no se puede pasar al armario (sin foto o sin categoría)
  onTogglePurchased: () => void;
  onOpenLink: () => void;
  onMoveToWardrobe: () => void;
  onEdit: () => void;
};

// Vista de un deseo: foto protagonista sobre fondo claro, datos y acciones.
// Solo dibuja: todo lo que pasa al tocar está en useWishlistDetail.
export function WishlistDetail({
  item,
  isBusy,
  error,
  canMove,
  moveHint,
  onTogglePurchased,
  onOpenLink,
  onMoveToWardrobe,
  onEdit,
}: WishlistDetailProps) {
  const insets = useSafeAreaInsets();
  const price = formatPrice(item.price);

  return (
    <ScrollView contentContainerStyle={{ gap: 20, padding: 24, paddingBottom: insets.bottom + 40 }}>
      <View className="rounded-2xl border-2 border-oak bg-ivory p-2">
        <GarmentImage
          imageUrl={item.imageUrl}
          swatchColor={item.dominantColor ?? COLORS.taupe}
          className="aspect-square w-full rounded-xl"
        />
      </View>

      <View className="gap-1">
        <Text className="font-display text-2xl text-ink">{item.name}</Text>
        <Text className="font-body text-sm text-ink-muted">{item.store ?? TEXT.noStore}</Text>
        <View className="flex-row flex-wrap items-center gap-2 pt-1">
          {price && <Text className="font-body-bold text-lg text-ink">{price}</Text>}
          <Badge label={item.category ?? TEXT.noCategory} />
        </View>
      </View>

      <WishOutfitMatches item={item} />

      <PurchasedToggle purchased={item.purchased} onToggle={onTogglePurchased} disabled={isBusy} />

      {!!error && (
        <Text
          accessibilityLiveRegion="polite"
          className="rounded-2xl border border-danger-border bg-danger-soft p-3 text-center font-body text-sm text-danger"
        >
          {error}
        </Text>
      )}

      <View className="gap-3">
        <Button label={TEXT.moveToWardrobe} onPress={onMoveToWardrobe} disabled={isBusy || !canMove} />
        {moveHint && <Text className="text-center font-body text-xs text-ink-muted">{moveHint}</Text>}
        {item.url && <Button label={TEXT.openLink} onPress={onOpenLink} variant="secondary" disabled={isBusy} />}
        <Button label={TEXT.edit} onPress={onEdit} variant="secondary" disabled={isBusy} />
      </View>
    </ScrollView>
  );
}
