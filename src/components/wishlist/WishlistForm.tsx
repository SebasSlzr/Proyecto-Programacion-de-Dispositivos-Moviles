import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View, type TextInputProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { WishlistInput } from '@/api/wishlist';
import { PhotoPicker } from '@/components/garments/PhotoPicker';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { CATEGORIES } from '@/constants/garments';
import { STRINGS } from '@/constants/strings';
import { COLORS } from '@/constants/theme';
import type { WishlistItem } from '@/types';
import { LinkImporter } from './LinkImporter';
import { useWishlistForm } from './useWishlistForm';

const TEXT = STRINGS.wishlistScreens;

type WishlistFormProps = {
  initialValues?: WishlistItem;
  onSubmit: (values: Partial<WishlistInput>) => Promise<void>;
  submitLabel: string;
};

// Campo de texto con su etiqueta, con el mismo estilo de los demás formularios.
function Field({ label, ...input }: TextInputProps & { label: string }) {
  return (
    <View className="gap-1.5">
      <Text className="font-body-medium text-sm text-ink">{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={COLORS.ink + '80'}
        className="min-h-12 rounded-2xl border border-taupe bg-ivory px-4 py-3 font-body text-ink"
        {...input}
      />
    </View>
  );
}

// Formulario de deseo: primero el link (que llena los datos solo) y debajo los campos
// editables. Solo dibuja: toda la lógica está en useWishlistForm.
export function WishlistForm({ initialValues, onSubmit, submitLabel }: WishlistFormProps) {
  const form = useWishlistForm({ initialValues, onSubmit });
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={{ gap: 20, padding: 24, paddingBottom: insets.bottom + 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <LinkImporter
          url={form.url}
          onChangeUrl={form.changeUrl}
          onRead={form.readLink}
          isReading={form.isReading}
          error={form.linkError}
          done={form.linkDone}
        />

        <View className="gap-1.5">
          <Text className="font-body-medium text-sm text-ink">{TEXT.photoLabel}</Text>
          <PhotoPicker
            uri={form.photoUri}
            swatchColor={COLORS.taupe}
            onChange={form.changePhoto}
            disabled={form.isSubmitting || form.isReading}
          />
        </View>

        <Field
          label={TEXT.nameLabel}
          placeholder={TEXT.namePlaceholder}
          value={form.name}
          onChangeText={form.setName}
          maxLength={80}
        />
        <Field
          label={TEXT.storeLabel}
          placeholder={TEXT.storePlaceholder}
          value={form.store}
          onChangeText={form.setStore}
          maxLength={60}
        />
        <Field
          label={TEXT.priceLabel}
          placeholder={TEXT.pricePlaceholder}
          value={form.price}
          onChangeText={form.setPrice}
          keyboardType="decimal-pad"
        />

        <View className="gap-1.5">
          <Text className="font-body-medium text-sm text-ink">{TEXT.categoryLabel}</Text>
          <Text className="font-body text-xs text-ink-muted">{TEXT.categoryHint}</Text>
          <View className="flex-row flex-wrap gap-2 pt-1">
            {CATEGORIES.map((option) => (
              <Chip
                key={option}
                label={option}
                selected={form.category === option}
                // Tocar la categoría elegida la quita (la categoría es opcional).
                onPress={() => form.setCategory(form.category === option ? null : option)}
              />
            ))}
          </View>
        </View>

        {!!form.error && (
          <Text
            accessibilityLiveRegion="polite"
            className="rounded-2xl border border-danger-border bg-danger-soft p-3 text-center font-body text-sm text-danger"
          >
            {form.error}
          </Text>
        )}

        <Button
          label={form.submitLabel ?? submitLabel}
          onPress={form.submit}
          disabled={form.isSubmitting || form.isReading}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
