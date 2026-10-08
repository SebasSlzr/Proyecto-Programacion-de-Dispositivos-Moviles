import { View, Text, ScrollView } from 'react-native';
import { SlotGarmentItem } from './SlotGarmentItem';
import { useSlotSelection } from './useSlotSelection';
import type { Garment } from '@/types';

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
  const { isSelected, orderOf, toggle } = useSlotSelection({ selectedIds, multiple, onChange });

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
            const selected = isSelected(garment.id);
            return (
              <SlotGarmentItem
                key={garment.id}
                garment={garment}
                isSelected={selected}
                order={multiple && selected ? orderOf(garment.id) : undefined}
                onPress={() => toggle(garment.id)}
              />
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}