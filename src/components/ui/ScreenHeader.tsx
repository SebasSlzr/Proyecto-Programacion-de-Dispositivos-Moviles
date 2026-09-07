import { View, Text } from 'react-native';

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
};

// Encabezado simple que van a repetir todas las pantallas: título grande
// en la fuente display, y un subtítulo opcional más discreto debajo.
export function ScreenHeader({ title, subtitle }: ScreenHeaderProps) {
  return (
    <View>
      <Text className="font-display text-3xl text-ink">{title}</Text>
      {subtitle ? (
        <Text className="font-body text-ink/60 text-sm mt-1">{subtitle}</Text>
      ) : null}
    </View>
  );
}