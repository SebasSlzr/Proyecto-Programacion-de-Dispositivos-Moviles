import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { GarmentImage } from '@/components/ui/GarmentImage';
import { COLORS } from '@/constants/theme';
import type { WishlistItem } from '@/types';
import { formatPrice } from './formatPrice';

// Textos provisionales: pasan a STRINGS.wishlist cuando Sebas una la Fase 0.
const LABELS = {
  purchased: 'Comprado',
  pending: 'Pendiente',
  noStore: 'Tienda sin indicar',
};

type WishlistCardProps = {
  item: WishlistItem;      // el deseo que se dibuja
  onPress: () => void;     // abre el detalle; la tarjeta no sabe navegar
};

// Tarjeta de un deseo en la lista: foto protagonista a la izquierda (sobre fondo claro,
// nunca sobre madera) y a la derecha nombre, tienda, precio y estado de compra.
export function WishlistCard({ item, onPress }: WishlistCardProps) {
  const price = formatPrice(item.price);
  const status = item.purchased ? LABELS.purchased : LABELS.pending;

  // Lo que lee el lector de pantalla al llegar a la tarjeta.
  const a11yLabel = [item.name, item.store, price, status].filter(Boolean).join(', ');

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
      className="flex-row gap-3 rounded-2xl border border-taupe bg-ivory p-3 shadow-sm active:translate-y-px"
      style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
    >
      <GarmentImage
        imageUrl={item.imageUrl}
        swatchColor={COLORS.taupe}
        className="h-24 w-24 rounded-xl"
        width={200}
      />

      <View className="flex-1 justify-between py-0.5">
        <View className="gap-0.5">
          <Text className="font-body-bold text-base text-ink" numberOfLines={2}>
            {item.name}
          </Text>
          <Text className="font-body text-xs text-walnut-light" numberOfLines={1}>
            {item.store ?? LABELS.noStore}
          </Text>
        </View>

        <View className="flex-row items-center justify-between gap-2">
          {price ? <Text className="font-body-medium text-sm text-ink">{price}</Text> : <View />}

          {/* Estado con ícono y texto, no solo con color. */}
          <View
            className={`flex-row items-center gap-1 rounded-full px-2 py-0.5 ${
              item.purchased ? 'bg-walnut' : 'border border-taupe'
            }`}
          >
            <Ionicons
              name={item.purchased ? 'checkmark-circle' : 'time-outline'}
              size={14}
              color={item.purchased ? COLORS.ivory : COLORS.walnut}
            />
            <Text className={`font-body-medium text-xs ${item.purchased ? 'text-ivory' : 'text-walnut'}`}>
              {status}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
