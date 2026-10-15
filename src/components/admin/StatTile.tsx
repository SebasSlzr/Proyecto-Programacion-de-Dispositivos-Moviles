import { Text, View } from 'react-native';

type StatTileProps = {
  label: string;
  value: number;
};

export function StatTile({ label, value }: StatTileProps) {
  return (
    <View className="flex-1 bg-ivory rounded-2xl p-3 items-center shadow-sm">
      <Text className="font-display text-2xl text-ink">{value}</Text>
      <Text className="font-body text-ink/60 text-xs mt-0.5">{label}</Text>
    </View>
  );
}