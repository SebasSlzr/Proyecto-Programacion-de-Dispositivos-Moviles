import { View, Text } from 'react-native';

type BadgeProps = {
  label: string;
  tone?: 'sage' | 'plum';
};

export function Badge({ label, tone = 'sage' }: BadgeProps) {
  if (tone === 'plum') {
    return (
      <View className="bg-plum/10 rounded-full px-2 py-0.5">
        <Text className="font-body text-xs text-plum">{label}</Text>
      </View>
    );
  }
  return (
    <View className="bg-sage/20 rounded-full px-2 py-0.5">
      <Text className="font-body text-xs text-sage">{label}</Text>
    </View>
  );
}