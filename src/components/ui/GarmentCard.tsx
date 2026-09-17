import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { Badge } from './Badge';
import type { Garment } from '../../types';

type GarmentCardProps = {
  garment: Garment;
};

export function GarmentCard({ garment }: GarmentCardProps) {
  return (
    <View className="bg-ivory rounded-2xl overflow-hidden mb-4 shadow-sm">
      <View className="h-40 items-center justify-center" style={{ backgroundColor: garment.swatchColor }}>
        <Ionicons name="shirt-outline" size={36} color={COLORS.ivory} />
      </View>
      <View className="p-3">
        <Text className="font-body-bold text-ink text-sm" numberOfLines={1}>
          {garment.name}
        </Text>
        <View className="flex-row items-center justify-between mt-2">
          <Text className="font-body text-ink/60 text-xs">{garment.category}</Text>
          <Badge label={garment.color} />
        </View>
      </View>
    </View>
  );
}