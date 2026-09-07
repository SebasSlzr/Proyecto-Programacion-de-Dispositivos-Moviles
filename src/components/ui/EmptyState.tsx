import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';

type EmptyStateProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
};

// Se usa en las pantallas que todavía no tienen contenido real
// (Outfits, Wishlist). En vez de un mensaje frío tipo "no hay datos",
// explica qué va a aparecer ahí y por qué está vacío por ahora.
export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <View className="items-center justify-center mt-16 px-8">
      <View className="bg-ivory rounded-full w-16 h-16 items-center justify-center mb-4">
        <Ionicons name={icon} size={28} color={COLORS.plum} />
      </View>
      <Text className="font-display text-xl text-ink text-center">{title}</Text>
      <Text className="font-body text-ink/60 text-sm text-center mt-2">{description}</Text>
    </View>
  );
}