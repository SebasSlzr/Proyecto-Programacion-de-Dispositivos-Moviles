import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import type { Garment } from '../../data/mockGarments';

type GarmentCardProps = {
  garment: Garment;
};

// Tarjeta de una prenda dentro del armario. El bloque de color de arriba
// es el placeholder de la foto — cuando exista la cámara + eliminación
// de fondo, ese View se reemplaza por una <Image> con la foto real.
export function GarmentCard({ garment }: GarmentCardProps) {
  return (
    <View className="bg-ivory rounded-2xl overflow-hidden mb-4 shadow-sm" style={{ width: '47%' }}>
      <View className="h-40 items-center justify-center" style={{ backgroundColor: garment.swatchColor }}>
        <Ionicons name="shirt-outline" size={36} color={COLORS.ivory} />
      </View>

      <View className="p-3">
        <Text className="font-body-bold text-ink text-sm" numberOfLines={1}>
          {garment.name}
        </Text>
        <View className="flex-row items-center justify-between mt-2">
          <Text className="font-body text-ink/60 text-xs">{garment.category}</Text>
          <View className="bg-sage/20 rounded-full px-2 py-0.5">
            <Text className="font-body text-sage text-xs">{garment.color}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}