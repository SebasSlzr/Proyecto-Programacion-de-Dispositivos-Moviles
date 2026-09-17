import { useState } from 'react';
import { View, Text, TextInput, ScrollView, Pressable } from 'react-native';
import { Button } from './Button';
import { Chip } from './Chip';
import { CATEGORIES, SWATCH_OPTIONS } from '../../constants/garments';
import { COLORS } from '../../constants/theme';
import type { GarmentInput } from '../../api/garments';

type GarmentFormProps = {
  initialValues?: GarmentInput;
  onSubmit: (values: Partial<GarmentInput>) => Promise<void>;
  submitLabel: string;
};

export function GarmentForm({ initialValues, onSubmit, submitLabel }: GarmentFormProps) {
  const [name, setName] = useState(initialValues?.name ?? '');
  const [category, setCategory] = useState(initialValues?.category ?? CATEGORIES[0]);
  const [color, setColor] = useState(initialValues?.color ?? '');
  const [swatchColor, setSwatchColor] = useState(initialValues?.swatchColor ?? SWATCH_OPTIONS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!name.trim() || !color.trim()) {
      setError('El nombre y el color son obligatorios');
      return;
    }
    setError(null);

    const current: GarmentInput = { name: name.trim(), category, color: color.trim(), swatchColor };

    // En edición, solo se manda lo que cambió respecto a lo que ya estaba
    // guardado. En creación no hay nada contra qué comparar, se manda todo.
    let payload: Partial<GarmentInput> = current;
    if (initialValues) {
      payload = {};
      (Object.keys(current) as (keyof GarmentInput)[]).forEach((key) => {
        if (current[key] !== initialValues[key]) payload[key] = current[key];
      });

      if (Object.keys(payload).length === 0) {
        setError('No hiciste ningún cambio');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await onSubmit(payload);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ gap: 20, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
      <View className="gap-1.5">
        <Text className="font-body-medium text-ink text-sm">Nombre de la prenda</Text>
        <TextInput
          className="font-body bg-ivory rounded-2xl px-4 py-3 text-ink border border-taupe"
          placeholder="Ej. Camiseta blanca básica"
          placeholderTextColor={COLORS.ink + '80'}
          value={name}
          onChangeText={setName}
          maxLength={60}
        />
      </View>

      <View className="gap-1.5">
        <Text className="font-body-medium text-ink text-sm">Categoría</Text>
        <View className="flex-row flex-wrap gap-2">
          {CATEGORIES.map((option) => (
            <Chip key={option} label={option} selected={category === option} onPress={() => setCategory(option)} />
          ))}
        </View>
      </View>

      <View className="gap-1.5">
        <Text className="font-body-medium text-ink text-sm">Color (nombre)</Text>
        <TextInput
          className="font-body bg-ivory rounded-2xl px-4 py-3 text-ink border border-taupe"
          placeholder="Ej. Azul, Negro, Vino tinto..."
          placeholderTextColor={COLORS.ink + '80'}
          value={color}
          onChangeText={setColor}
          maxLength={30}
        />
      </View>

      <View className="gap-1.5">
        <Text className="font-body-medium text-ink text-sm">Color de la prenda</Text>
        <View className="flex-row flex-wrap gap-3">
          {SWATCH_OPTIONS.map((hex) => (
            <Pressable
              key={hex}
              onPress={() => setSwatchColor(hex)}
              className="w-10 h-10 rounded-full"
              style={{
                backgroundColor: hex,
                borderWidth: swatchColor === hex ? 3 : 1,
                borderColor: swatchColor === hex ? COLORS.plum : COLORS.taupe,
              }}
            />
          ))}
        </View>
      </View>

      {!!error && (
        <Text className="font-body text-sm text-red-500 bg-red-50 rounded-2xl p-3 text-center">{error}</Text>
      )}

      <Button label={isSubmitting ? 'Guardando…' : submitLabel} onPress={submit} disabled={isSubmitting} />
    </ScrollView>
  );
}