import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Badge } from '@/components/ui/Badge';
import { GarmentImage } from '@/components/ui/GarmentImage';
import { COLORS } from '@/constants/theme';
import { STRINGS } from '@/constants/strings';
import type { WishlistItem } from '@/types';
import { useWishOutfitMatches } from './useWishOutfitMatches';

type WishOutfitMatchesProps = {
  item: WishlistItem; // el deseo que se quiere analizar
};

const TEXTS = STRINGS.outfits.wishMatches;

// Regla de los 3 outfits en el detalle de un deseo: veredicto arriba y, debajo,
// las combinaciones en miniatura con la prenda del deseo marcada como "Nueva".
// El veredicto lleva ícono y texto, así no depende solo del color.
export function WishOutfitMatches({ item }: WishOutfitMatchesProps) {
  const { status, matches, verdict, layersOf, wishGarmentId } = useWishOutfitMatches(item);

  if (status === 'loading') {
    return <ActivityIndicator color={COLORS.walnut} style={{ marginVertical: 16 }} />;
  }

  if (status === 'missing-data' || status === 'empty-wardrobe') {
    return (
      <View className="flex-row items-center gap-3 bg-ivory border border-taupe rounded-2xl p-4">
        <Ionicons name="information-circle-outline" size={22} color={COLORS.inkMuted} />
        <Text className="flex-1 font-body text-ink text-sm">
          {status === 'missing-data' ? TEXTS.missingData : TEXTS.emptyWardrobe}
        </Text>
      </View>
    );
  }

  const verdictView = {
    'vale-la-pena': { icon: 'checkmark-circle' as const, color: COLORS.sageDark, text: TEXTS.worth(matches.length), textClass: 'text-sage-dark' },
    pensarlo: { icon: 'help-circle-outline' as const, color: COLORS.ink, text: TEXTS.think(matches.length), textClass: 'text-ink' },
    'no-combina': { icon: 'close-circle-outline' as const, color: COLORS.inkMuted, text: TEXTS.none, textClass: 'text-ink-muted' },
  }[verdict];

  return (
    <View className="gap-3">
      <Text className="font-display text-ink text-xl">{TEXTS.title}</Text>

      <View className="flex-row items-center gap-3 bg-ivory border border-taupe rounded-2xl p-4 shadow-sm">
        <Ionicons name={verdictView.icon} size={24} color={verdictView.color} />
        <Text className={`flex-1 font-body-bold text-sm ${verdictView.textClass}`}>{verdictView.text}</Text>
      </View>

      {matches.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
          {matches.map((outfit, index) => (
            <View
              key={index}
              accessibilityLabel={TEXTS.outfitLabel(index + 1)}
              className="bg-ivory border border-taupe rounded-2xl p-2 items-center gap-1"
            >
              {layersOf(outfit).map((garment) => (
                <View key={garment.id} className="items-center">
                  <GarmentImage
                    imageUrl={garment.imageUrl}
                    swatchColor={garment.swatchColor}
                    className="w-16 h-12 rounded-lg border border-taupe"
                    width={160}
                  />
                  {garment.id === wishGarmentId && (
                    <View className="mt-0.5">
                      <Badge label={TEXTS.newBadge} tone="plum" />
                    </View>
                  )}
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
