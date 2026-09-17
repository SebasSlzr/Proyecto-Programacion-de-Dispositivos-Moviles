import { Pressable, Text } from 'react-native';

type ChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

// El patrón de "pastilla seleccionable" se repetía en categorías, filtros
// y selección de prendas — por eso se volvió componente.
export function Chip({ label, selected, onPress }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-full px-4 py-2 border ${selected ? 'bg-plum border-plum' : 'bg-ivory border-taupe'}`}
    >
      <Text className={`font-body-medium text-sm ${selected ? 'text-ivory' : 'text-ink'}`}>{label}</Text>
    </Pressable>
  );
}