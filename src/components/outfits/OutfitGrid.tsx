import { View, Pressable } from 'react-native';
import { OutfitCard } from './OutfitCard';
import type { Outfit } from '@/types';

type OutfitGridProps = {
  outfits: Outfit[];
  onPressOutfit: (outfit: Outfit) => void;
};

// Grilla de dos columnas con las tarjetas de outfits; tocar una abre su edición.
export function OutfitGrid({ outfits, onPressOutfit }: OutfitGridProps) {
  return (
    <View className="flex-row flex-wrap justify-between mt-6">
      {outfits.map((outfit) => (
        <Pressable key={outfit.id} style={{ width: '47%' }} onPress={() => onPressOutfit(outfit)}>
          <OutfitCard outfit={outfit} />
        </Pressable>
      ))}
    </View>
  );
}