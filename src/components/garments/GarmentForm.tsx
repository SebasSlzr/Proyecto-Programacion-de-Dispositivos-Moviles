import type { GarmentInput } from '@/api/garments';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { CATEGORIES, SWATCH_OPTIONS } from '@/constants/garments';
import { COLORS } from '@/constants/theme';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { PhotoPicker } from './PhotoPicker';
import { useGarmentForm } from './useGarmentForm';

type GarmentFormProps = {
  initialValues?: GarmentInput;
  onSubmit: (values: Partial<GarmentInput>) => Promise<void>;
  submitLabel: string;
};

export function GarmentForm({ initialValues, onSubmit, submitLabel }: GarmentFormProps) {
  const form = useGarmentForm({ initialValues, onSubmit });

  return (
    <ScrollView contentContainerStyle={{ gap: 20, padding: 24, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
      <PhotoPicker
        uri={form.photoUri}
        swatchColor={form.swatchColor}
        onChange={form.setPhotoUri}
        disabled={form.isSubmitting}
      />

      <View className="gap-1.5">
        <Text className="font-body-medium text-ink text-sm">Nombre de la prenda</Text>
        <TextInput
          className="font-body bg-ivory rounded-2xl px-4 py-3 text-ink border border-taupe"
          placeholder="Ej. Camiseta blanca básica"
          placeholderTextColor={COLORS.ink + '80'}
          value={form.name}
          onChangeText={form.setName}
          maxLength={60}
        />
      </View>

      <View className="gap-1.5">
        <Text className="font-body-medium text-ink text-sm">Categoría</Text>
        <View className="flex-row flex-wrap gap-2">
          {CATEGORIES.map((option) => (
            <Chip
              key={option}
              label={option}
              selected={form.category === option}
              onPress={() => form.setCategory(option)}
            />
          ))}
        </View>
      </View>

      <View className="gap-1.5">
        <Text className="font-body-medium text-ink text-sm">Color (nombre)</Text>
        <TextInput
          className="font-body bg-ivory rounded-2xl px-4 py-3 text-ink border border-taupe"
          placeholder="Ej. Azul, Negro, Vino tinto..."
          placeholderTextColor={COLORS.ink + '80'}
          value={form.color}
          onChangeText={form.setColor}
          maxLength={30}
        />
      </View>

      <View className="gap-1.5">
        <Text className="font-body-medium text-ink text-sm">Color de la prenda</Text>
        <View className="flex-row flex-wrap gap-3">
          {SWATCH_OPTIONS.map((hex) => (
            <Pressable
              key={hex}
              onPress={() => form.setSwatchColor(hex)}
              className="w-12 h-12 rounded-full"
              accessibilityRole="button"
              accessibilityLabel={`Color ${hex}`}
              accessibilityState={{ selected: form.swatchColor === hex }}
              style={{
                backgroundColor: hex,
                borderWidth: form.swatchColor === hex ? 3 : 1,
                borderColor: form.swatchColor === hex ? COLORS.walnut : COLORS.taupe,
              }}
            />
          ))}
        </View>
      </View>

      {!!form.error && (
        <Text className="font-body text-sm text-red-500 bg-red-50 rounded-2xl p-3 text-center">{form.error}</Text>
      )}

      <Button label={form.submitLabel ?? submitLabel} onPress={form.submit} disabled={form.isSubmitting} />
    </ScrollView>
  );
}