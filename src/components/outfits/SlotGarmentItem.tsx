import { View, Text, Pressable } from 'react-native';
import { GarmentImage } from '@/components/ui/GarmentImage';
import type { Garment } from '@/types';

type SlotGarmentItemProps = {
  garment: Garment;
  isSelected: boolean;
  // Número de capa a mostrar en la esquina; si no se pasa, no se muestra.
  order?: number;
  onPress: () => void;
};

// Una prenda dentro del selector de un espacio: muestra su foto (o su color
// de muestra si no tiene), el borde de seleccionada y, en el torso, el número
// de capa. El borde va en un contenedor aparte porque GarmentImage recorta su
// contenido (overflow hidden) y taparía el número de la esquina.
export function SlotGarmentItem({ garment, isSelected, order, onPress }: SlotGarmentItemProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      accessibilityLabel={garment.name}
      className="items-center gap-1 active:opacity-85"
    >
      <View className={`rounded-[18px] ${isSelected ? 'border-[3px] border-walnut' : 'border border-taupe'}`}>
        <GarmentImage
          imageUrl={garment.imageUrl}
          swatchColor={garment.swatchColor}
          className="w-16 h-16 rounded-2xl"
          width={160}
        />
        {order !== undefined && (
          <View className="absolute -top-2 -right-2 bg-walnut rounded-full w-5 h-5 items-center justify-center">
            <Text className="font-body-bold text-ivory text-xs">{order}</Text>
          </View>
        )}
      </View>
      <Text className="font-body text-ink/70 text-xs max-w-16" numberOfLines={1}>
        {garment.name}
      </Text>
    </Pressable>
  );
}
