import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { STRINGS } from '@/constants/strings';
import type { Harmony } from '@/utils/suggestOutfit';

type SuggestionBannerProps = {
  harmony: Harmony;      // por qué combina la sugerencia
  onDismiss: () => void; // cerrar el banner
};

// Explica en una línea por qué combina la sugerencia. Lleva ícono y texto,
// así el mensaje no depende solo del color.
export function SuggestionBanner({ harmony, onDismiss }: SuggestionBannerProps) {
  return (
    <View className="flex-row items-center gap-3 bg-ivory border border-sage rounded-2xl pl-4 py-2 shadow-sm">
      <Ionicons name="color-palette-outline" size={22} color={COLORS.sageDark} />
      <View className="flex-1 gap-0.5 py-1">
        <Text className="font-body-bold text-ink text-sm">{STRINGS.outfits.suggestionNames[harmony]}</Text>
        <Text className="font-body text-ink-muted text-sm">{STRINGS.outfits.suggestionReasons[harmony]}</Text>
      </View>
      <Pressable
        onPress={onDismiss}
        accessibilityRole="button"
        accessibilityLabel={STRINGS.outfits.dismissSuggestion}
        className="min-h-12 min-w-12 items-center justify-center active:opacity-85"
      >
        <Ionicons name="close" size={20} color={COLORS.inkMuted} />
      </Pressable>
    </View>
  );
}
