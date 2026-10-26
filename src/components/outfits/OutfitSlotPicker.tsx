import { View, Text, ScrollView } from 'react-native';
import { WoodSurface } from '@/components/ui/WoodSurface';
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
// Cada espacio es una repisa de roble con su nombre; las prendas van debajo,
// sobre el fondo claro, para que las fotos sean las protagonistas.
export function OutfitSlotPicker({ label, garments, selectedIds, multiple, onChange }: OutfitSlotPickerProps) {
  const { isSelected, orderOf, toggle } = useSlotSelection({ selectedIds, multiple, onChange });

  return (
    <View className="gap-3">
      <WoodSurface variant="oak" radius={8} className="px-4 py-2 flex-row items-center justify-between">
        <Text className="font-body-bold text-walnut-dark text-sm">{label}</Text>
        {multiple && <Text className="font-body-medium text-walnut-dark text-xs">Se apilan en orden</Text>}
      </WoodSurface>

      {garments.length === 0 ? (
        <Text className="font-body text-ink/60 text-xs px-1">No tienes prendas para esta zona todavía.</Text>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          // El padding deja espacio para el número de capa, que sobresale de la esquina.
          contentContainerClassName="gap-3 pt-2 px-1"
        >
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
