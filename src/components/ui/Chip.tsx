import { Pressable, Text } from 'react-native';
import { WoodPressable } from './WoodPressable';

type ChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

// El chip mide 36 px de alto; esto completa los 44 px de área táctil mínima.
const HIT_SLOP = { top: 4, bottom: 4 };

// El patrón de "pastilla seleccionable" se repetía en categorías, filtros
// y selección de prendas — por eso se volvió componente.
// - En reposo: roble claro con borde de roble y texto nogal oscuro.
// - Seleccionado: madera de nogal con texto ivory.
export function Chip({ label, selected, onPress }: ChipProps) {
  if (selected) {
    return (
      <WoodPressable onPress={onPress} radius={999} hitSlop={HIT_SLOP} className="px-4 py-2">
        <Text className="font-body-medium text-sm text-ivory">{label}</Text>
      </WoodPressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      hitSlop={HIT_SLOP}
      accessibilityRole="button"
      accessibilityState={{ selected: false }}
      className="rounded-full px-4 py-2 border bg-oak-light border-oak active:opacity-85 active:translate-y-px"
    >
      <Text className="font-body-medium text-sm text-walnut-dark">{label}</Text>
    </Pressable>
  );
}
