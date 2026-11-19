import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WoodPressable } from '@/components/ui/WoodPressable';
import { COLOR_FAMILIES } from '@/constants/colors';
import { STRINGS } from '@/constants/strings';
import { COLORS } from '@/constants/theme';
import type { ColorFamily } from '@/utils/color';

type ColorFilterProps = {
  available: ColorFamily[];                  // familias presentes en el armario (las demás no se muestran)
  selected: ColorFamily | null;              // familia elegida, o null si se ven todos los colores
  onSelect: (family: ColorFamily) => void;   // tocar una familia (tocarla otra vez la quita)
  onClear: () => void;                       // "Todos los colores"
};

// El chip mide 36 px de alto; esto completa el área táctil mínima.
const HIT_SLOP = { top: 6, bottom: 6 };

// Fila horizontal de chips de color, con el mismo aspecto que CategoryFilter.
// Cada chip lleva un punto con el color de muestra de la familia (los hexadecimales
// vienen de COLOR_FAMILIES, no se escriben aquí) y su nombre. El seleccionado,
// además de pasar a madera de nogal, muestra un visto: así el estado no depende
// solo del color.
export function ColorFilter({ available, selected, onSelect, onClear }: ColorFilterProps) {
  const families = COLOR_FAMILIES.filter((family) => available.includes(family.key));

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
      <ColorChip label={STRINGS.wardrobe.allColors} selected={selected === null} onPress={onClear} />
      {families.map((family) => (
        <ColorChip
          key={family.key}
          label={family.label}
          sample={family.sample}
          selected={selected === family.key}
          onPress={() => onSelect(family.key)}
        />
      ))}
    </ScrollView>
  );
}

type ColorChipProps = {
  label: string;
  sample?: string;   // color del punto; sin él (opción "Todos") no se dibuja punto
  selected: boolean;
  onPress: () => void;
};

// Chip interno del filtro: como Chip, pero con el punto de color y el visto.
function ColorChip({ label, sample, selected, onPress }: ColorChipProps) {
  const content = (textClass: string) => (
    <View className="flex-row items-center gap-2">
      {selected && <Ionicons name="checkmark" size={14} color={COLORS.ivory} />}
      {sample && (
        <View
          className="w-3.5 h-3.5 rounded-full border border-ivory"
          style={{ backgroundColor: sample }}
        />
      )}
      <Text className={`font-body-medium text-sm ${textClass}`}>{label}</Text>
    </View>
  );

  if (selected) {
    return (
      <WoodPressable
        onPress={onPress}
        radius={999}
        hitSlop={HIT_SLOP}
        accessibilityLabel={`${label}, seleccionado`}
        className="px-4 py-2"
      >
        {content('text-ivory')}
      </WoodPressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      hitSlop={HIT_SLOP}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: false }}
      className="rounded-full px-4 py-2 border bg-oak-light border-oak active:opacity-85 active:translate-y-px"
    >
      {content('text-walnut-dark')}
    </Pressable>
  );
}
