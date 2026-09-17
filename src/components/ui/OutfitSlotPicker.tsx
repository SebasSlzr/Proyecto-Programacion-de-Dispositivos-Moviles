import { View, Text, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import type { Garment } from '../../types';

type OutfitSlotPickerProps = {
  label: string;
  garments: Garment[];
  selectedIds: string[];
  multiple: boolean;
  onChange: (ids: string[]) => void;
};

// Un mismo picker sirve para los 4 espacios del outfit — cambia solo si
// permite una prenda o varias apiladas (torso).
export function OutfitSlotPicker({ label, garments, selectedIds, multiple, onChange }: OutfitSlotPickerProps) {
  const toggle = (id: string) => {
    if (multiple) {
      const isSelected = selectedIds.includes(id);
      onChange(isSelected ? selectedIds.filter((existing) => existing !== id) : [...selectedIds, id]);
    } else {
      onChange(selectedIds.includes(id) ? [] : [id]);
    }
  };

  return (
    <View className="gap-2">
      <Text className="font-body-medium text-ink text-sm">
        {label} {multiple ? '(puedes elegir varias, se apilan en orden)' : ''}
      </Text>

      {garments.length === 0 ? (
        <Text className="font-body text-ink/60 text-xs">No tienes prendas todavía.</Text>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
          {garments.map((garment) => {
            const isSelected = selectedIds.includes(garment.id);
            const order = selectedIds.indexOf(garment.id);
            return (
              <Pressable key={garment.id} onPress={() => toggle(garment.id)} className="items-center gap-1">
                <View
                  className="w-16 h-16 rounded-2xl items-center justify-center"
                  style={{
                    backgroundColor: garment.swatchColor,
                    borderWidth: isSelected ? 3 : 1,
                    borderColor: isSelected ? COLORS.plum : COLORS.taupe,
                  }}
                >
                  <Ionicons name="shirt-outline" size={22} color={COLORS.ivory} />
                  {multiple && isSelected && (
                    <View className="absolute -top-1.5 -right-1.5 bg-plum rounded-full w-5 h-5 items-center justify-center">
                      <Text className="font-body-bold text-ivory text-xs">{order + 1}</Text>
                    </View>
                  )}
                </View>
                <Text className="font-body text-ink/70 text-xs" numberOfLines={1} style={{ maxWidth: 64 }}>
                  {garment.name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}