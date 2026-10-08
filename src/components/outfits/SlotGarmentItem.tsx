import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import type { Garment } from '@/types';

type SlotGarmentItemProps = {
  garment: Garment;
  isSelected: boolean;
  // Número de capa a mostrar en la esquina; si no se pasa, no se muestra.
  order?: number;
  onPress: () => void;
};

// Una prenda dentro del selector de un espacio: muestra su color, el borde
// de seleccionada y, en el torso, el número de capa.
export function SlotGarmentItem({ garment, isSelected, order, onPress }: SlotGarmentItemProps) {
  return (
    <Pressable onPress={onPress} className="items-center gap-1">
      <View
        className="w-16 h-16 rounded-2xl items-center justify-center"
        style={{
          backgroundColor: garment.swatchColor,
          borderWidth: isSelected ? 3 : 1,
          borderColor: isSelected ? COLORS.plum : COLORS.taupe,
        }}
      >
        <Ionicons name="shirt-outline" size={22} color={COLORS.ivory} />
        {order !== undefined && (
          <View className="absolute -top-1.5 -right-1.5 bg-plum rounded-full w-5 h-5 items-center justify-center">
            <Text className="font-body-bold text-ivory text-xs">{order}</Text>
          </View>
        )}
      </View>
      <Text className="font-body text-ink/70 text-xs" numberOfLines={1} style={{ maxWidth: 64 }}>
        {garment.name}
      </Text>
    </Pressable>
  );
}