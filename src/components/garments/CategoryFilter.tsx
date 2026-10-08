import { ScrollView } from 'react-native';
import { Chip } from '@/components/ui/Chip';
import { CATEGORIES } from '@/constants/garments';

type CategoryFilterProps = {
  selected: string | null;
  onSelect: (category: string) => void;
  onClear: () => void;
};

// Fila horizontal de chips: "Todas" más una por categoría.
export function CategoryFilter({ selected, onSelect, onClear }: CategoryFilterProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
      <Chip label="Todas" selected={selected === null} onPress={onClear} />
      {CATEGORIES.map((category) => (
        <Chip
          key={category}
          label={category}
          selected={selected === category}
          onPress={() => onSelect(category)}
        />
      ))}
    </ScrollView>
  );
}