import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import type { Outfit } from '../../types';

type OutfitCardProps = {
  outfit: Outfit;
};

// Representación "de arriba a abajo": un bloque de color por capa, en
// orden — cabeza, cada capa de torso, piernas, pies.
export function OutfitCard({ outfit }: OutfitCardProps) {
  const layers = [outfit.head, ...outfit.torso, outfit.legs, outfit.feet].filter(
    (item): item is NonNullable<typeof item> => item !== null
  );

  return (
    <View className="bg-ivory rounded-2xl overflow-hidden mb-4 shadow-sm p-3">
      <View className="items-center justify-center gap-1 h-40">
        {layers.length === 0 ? (
          <Ionicons name="shirt-outline" size={28} color={COLORS.taupe} />
        ) : (
          layers.map((garment, index) => (
            <View
              key={`${garment.id}-${index}`}
              className="w-16 rounded-lg"
              style={{ backgroundColor: garment.swatchColor, height: 36 }}
            />
          ))
        )}
      </View>
      <Text className="font-body-bold text-ink text-sm mt-2" numberOfLines={1}>
        {outfit.name}
      </Text>
      <Text className="font-body text-ink/60 text-xs mt-0.5">{layers.length} prendas</Text>
    </View>
  );
}