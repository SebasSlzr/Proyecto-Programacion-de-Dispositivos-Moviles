import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GarmentImage } from '@/components/ui/GarmentImage';
import { Hanger } from '@/components/ui/Hanger';
import { MetalRail } from '@/components/ui/MetalRail';
import { COLORS } from '@/constants/theme';
import type { Outfit } from '@/types';
import { useOutfitLayers } from './useOutfitLayers';

type OutfitCardProps = {
  outfit: Outfit;
  onPress: () => void; // qué hacer al tocar la tarjeta (la pantalla decide: abrir la edición)
};

// Misma sombra que GarmentCard: suave en reposo y casi nula al presionar.
const RESTING_SHADOW = {
  shadowColor: '#1E120A',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.18,
  shadowRadius: 6,
  elevation: 3,
};

const PRESSED_SHADOW = {
  shadowColor: '#1E120A',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.08,
  shadowRadius: 2,
  elevation: 1,
};

// Alto del área de capas y de cada miniatura. Con pocas prendas cada foto mide
// hasta 48 px; con muchas capas de torso se achican para que todas quepan.
const LAYERS_HEIGHT = 176;
const LAYER_GAP = 4;
const MAX_LAYER_HEIGHT = 48;

// Outfit colgado de una sola percha: las prendas se ven "de arriba a abajo"
// (cabeza, cada capa del torso, piernas y pies), cada una con su foto o, si
// no tiene, con su color de muestra. Mismo estado presionado que GarmentCard.
export function OutfitCard({ outfit, onPress }: OutfitCardProps) {
  const layers = useOutfitLayers(outfit);
  const count = layers.length;
  const layerHeight = Math.min(
    MAX_LAYER_HEIGHT,
    Math.floor((LAYERS_HEIGHT - LAYER_GAP * Math.max(count - 1, 0)) / Math.max(count, 1))
  );
  const countLabel = `${count} ${count === 1 ? 'prenda' : 'prendas'}`;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${outfit.name}, ${countLabel}`}
      accessibilityHint="Abre el outfit para verlo o editarlo"
      className="mb-5"
    >
      {({ pressed }) => (
        <>
          <MetalRail className="-mx-2" />

          <View style={{ transform: [{ translateY: pressed ? 2 : 0 }] }}>
            <View className="items-center" style={{ marginTop: -10 }}>
              <Hanger size={56} />
            </View>

            <View className="bg-ivory rounded-2xl" style={pressed ? PRESSED_SHADOW : RESTING_SHADOW}>
              <View className="bg-ivory rounded-2xl border border-taupe p-3 overflow-hidden">
                <View className="items-center justify-center" style={{ height: LAYERS_HEIGHT, gap: LAYER_GAP }}>
                  {count === 0 ? (
                    <Ionicons name="shirt-outline" size={28} color={COLORS.taupe} />
                  ) : (
                    layers.map((garment, index) => (
                      <View
                        key={`${garment.id}-${index}`}
                        className="rounded-lg border border-taupe overflow-hidden"
                        style={{ width: 72, height: layerHeight }}
                      >
                        <GarmentImage
                          imageUrl={garment.imageUrl}
                          swatchColor={garment.swatchColor}
                          className="w-full h-full"
                          width={200}
                        />
                      </View>
                    ))
                  )}
                </View>

                <Text className="font-body-bold text-ink text-sm mt-3" numberOfLines={1}>
                  {outfit.name}
                </Text>
                <Text className="font-body text-ink/70 text-xs mt-0.5">{countLabel}</Text>
              </View>
            </View>
          </View>
        </>
      )}
    </Pressable>
  );
}