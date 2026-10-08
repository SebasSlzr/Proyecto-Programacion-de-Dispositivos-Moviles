import { Pressable, View } from 'react-native';
import type { Garment } from '@/types';
import { GarmentCard } from './GarmentCard';

type GarmentGridProps = {
  garments: Garment[];
  onPressGarment: (garment: Garment) => void;
};

// Grilla de dos columnas; cada tarjeta es tocable.
export function GarmentGrid({ garments, onPressGarment }: GarmentGridProps) {
  return (
    <View className="flex-row flex-wrap justify-between mt-6">
      {garments.map((garment) => (
        <Pressable key={garment.id} style={{ width: '47%' }} onPress={() => onPressGarment(garment)}>
          <GarmentCard garment={garment} />
        </Pressable>
      ))}
    </View>
  );
}