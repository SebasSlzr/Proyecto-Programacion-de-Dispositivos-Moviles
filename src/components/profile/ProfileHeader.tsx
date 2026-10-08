import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { COLORS } from '@/constants/theme';

type ProfileHeaderProps = {
  onClose: () => void;
};

export function ProfileHeader({ onClose }: ProfileHeaderProps) {
  return (
    <View className="flex-row items-start justify-between">
      <ScreenHeader title="Tu perfil" subtitle="Administra tu cuenta" />
      <Pressable
        onPress={onClose}
        className="bg-ivory rounded-full w-9 h-9 items-center justify-center"
      >
        <Ionicons name="close" size={18} color={COLORS.ink} />
      </Pressable>
    </View>
  );
}
