import { Ionicons } from '@expo/vector-icons';
import { Text, TextInput, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { STRINGS } from '@/constants/strings';
import { COLORS } from '@/constants/theme';

const TEXT = STRINGS.wishlistScreens;

type LinkImporterProps = {
  url: string;                       // lo que la usuaria escribió o pegó
  onChangeUrl: (url: string) => void;
  onRead: () => void;                // el padre llama a previewWishlistLink
  isReading: boolean;                // mientras el servidor lee el link
  error: string | null;              // mensaje si no se pudo leer (400 o 422)
  done: boolean;                     // true cuando el link se leyó bien
};

// Caja para pegar el link de una prenda y pedir que se lean sus datos.
// Solo dibuja: no llama a la API ni decide los mensajes, eso lo hace el hook del formulario.
// El resultado se muestra con ícono y texto, no solo con color.
export function LinkImporter({ url, onChangeUrl, onRead, isReading, error, done }: LinkImporterProps) {
  const canRead = url.trim().length > 0 && !isReading;

  return (
    <View className="gap-2 rounded-2xl border border-taupe bg-ivory p-4">
      <Text className="font-body-medium text-sm text-ink">{TEXT.linkLabel}</Text>

      <TextInput
        value={url}
        onChangeText={onChangeUrl}
        placeholder={TEXT.linkPlaceholder}
        placeholderTextColor={COLORS.ink + '80'}
        keyboardType="url"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="go"
        onSubmitEditing={canRead ? onRead : undefined}
        editable={!isReading}
        accessibilityLabel={TEXT.linkLabel}
        accessibilityHint={TEXT.linkHint}
        className="min-h-12 rounded-2xl border border-taupe bg-linen px-4 py-3 font-body text-ink"
      />

      <Text className="font-body text-xs text-walnut-light">{TEXT.linkHint}</Text>

      <Button label={isReading ? TEXT.readingLink : TEXT.readLink} onPress={onRead} variant="secondary" disabled={!canRead} />

      {!!error && (
        <View accessibilityLiveRegion="polite" className="flex-row items-start gap-2 rounded-2xl bg-danger-soft border border-danger-border p-3">
          <Ionicons name="alert-circle" size={18} color={COLORS.walnut} />
          <Text className="flex-1 font-body text-sm text-danger">{error}</Text>
        </View>
      )}

      {done && !error && (
        <View accessibilityLiveRegion="polite" className="flex-row items-start gap-2 rounded-2xl border border-taupe p-3">
          <Ionicons name="checkmark-circle" size={18} color={COLORS.walnut} />
          <Text className="flex-1 font-body text-sm text-ink">{TEXT.linkDone}</Text>
        </View>
      )}
    </View>
  );
}
