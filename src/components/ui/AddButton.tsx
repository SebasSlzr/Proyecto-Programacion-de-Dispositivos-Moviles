import { Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';

type AddButtonProps = { label: string; onPress: () => void };

// Píldora ancha con ícono "+" para crear un elemento nuevo.
export function AddButton({ label, onPress }: AddButtonProps) {
  return (
    <Pressable onPress={onPress} className="bg-plum rounded-full py-3 flex-row items-center justify-center gap-2">
      <Ionicons name="add" size={20} color={COLORS.ivory} />
      <Text className="font-body-bold text-ivory text-base">{label}</Text>
    </Pressable>
  );
}
