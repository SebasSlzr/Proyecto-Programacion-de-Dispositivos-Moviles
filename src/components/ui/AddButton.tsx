import { Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { WoodPressable } from './WoodPressable';

type AddButtonProps = { label: string; onPress: () => void };

// Píldora ancha de nogal con ícono "+" para crear un elemento nuevo.
export function AddButton({ label, onPress }: AddButtonProps) {
  return (
    <WoodPressable onPress={onPress} radius={999} className="py-3.5 flex-row items-center justify-center gap-2">
      <Ionicons name="add" size={20} color={COLORS.ivory} />
      <Text className="font-body-bold text-ivory text-base">{label}</Text>
    </WoodPressable>
  );
}
