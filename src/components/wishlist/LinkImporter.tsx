import { Ionicons } from '@expo/vector-icons';
import { Text, TextInput, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { COLORS } from '@/constants/theme';

// Textos provisionales: pasan a STRINGS.wishlist cuando Sebas una la Fase 0.
const LABELS = {
  label: 'Link de la prenda',
  placeholder: 'Pega el link de la tienda o de Instagram',
  hint: 'Leemos el nombre, la tienda, el precio y la foto para que no los escribas tú.',
  read: 'Leer link',
  reading: 'Leyendo…',
  done: 'Listo. Revisa los datos que encontramos y corrige lo que haga falta.',
};

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
      <Text className="font-body-medium text-sm text-ink">{LABELS.label}</Text>

      <TextInput
        value={url}
        onChangeText={onChangeUrl}
        placeholder={LABELS.placeholder}
        placeholderTextColor={COLORS.ink + '80'}
        keyboardType="url"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="go"
        onSubmitEditing={canRead ? onRead : undefined}
        editable={!isReading}
        accessibilityLabel={LABELS.label}
        accessibilityHint={LABELS.hint}
        className="min-h-12 rounded-2xl border border-taupe bg-linen px-4 py-3 font-body text-ink"
      />

      <Text className="font-body text-xs text-walnut-light">{LABELS.hint}</Text>

      <Button label={isReading ? LABELS.reading : LABELS.read} onPress={onRead} variant="secondary" disabled={!canRead} />

      {!!error && (
        <View accessibilityLiveRegion="polite" className="flex-row items-start gap-2 rounded-2xl bg-red-50 p-3">
          <Ionicons name="alert-circle" size={18} color={COLORS.walnut} />
          <Text className="flex-1 font-body text-sm text-red-700">{error}</Text>
        </View>
      )}

      {done && !error && (
        <View accessibilityLiveRegion="polite" className="flex-row items-start gap-2 rounded-2xl border border-taupe p-3">
          <Ionicons name="checkmark-circle" size={18} color={COLORS.walnut} />
          <Text className="flex-1 font-body text-sm text-ink">{LABELS.done}</Text>
        </View>
      )}
    </View>
  );
}
