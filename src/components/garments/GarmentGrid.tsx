import { View } from 'react-native';
import type { Garment } from '@/types';
import { GarmentCard } from './GarmentCard';

type GarmentGridProps = {
  garments: Garment[];
  onPressGarment: (garment: Garment) => void;
};

// Grilla temporal de dos columnas; en el paso 3 la reemplaza la FlatList.
export function GarmentGrid({ garments, onPressGarment }: GarmentGridProps) {
  return (
    <View className="flex-row flex-wrap justify-between mt-6">
      {garments.map((garment) => (
        <View key={garment.id} style={{ width: '48%' }}>
          <GarmentCard garment={garment} onPress={() => onPressGarment(garment)} />
        </View>
      ))}
    </View>
  );
}