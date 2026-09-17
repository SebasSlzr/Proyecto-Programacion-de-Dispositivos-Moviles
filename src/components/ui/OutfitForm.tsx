import { useState } from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import { Button } from './Button';
import { OutfitSlotPicker } from './OutfitSlotPicker';
import { OUTFIT_SLOTS, type OutfitSlotKey } from '../../constants/outfits';
import { COLORS } from '../../constants/theme';
import type { OutfitInput } from '../../api/outfits';
import type { Garment } from '../../types';

type OutfitFormProps = {
  wardrobe: Garment[];
  initialValues?: OutfitInput;
  onSubmit: (values: Partial<OutfitInput>) => Promise<void>;
  submitLabel: string;
};

type SlotsState = Record<OutfitSlotKey, string[]>;

function toSlotsState(values?: OutfitInput): SlotsState {
  return {
    head: values?.head ? [values.head] : [],
    torso: values?.torso ?? [],
    legs: values?.legs ? [values.legs] : [],
    feet: values?.feet ? [values.feet] : [],
  };
}

export function OutfitForm({ wardrobe, initialValues, onSubmit, submitLabel }: OutfitFormProps) {
  const [name, setName] = useState(initialValues?.name ?? '');
  const [slots, setSlots] = useState<SlotsState>(toSlotsState(initialValues));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!name.trim()) {
      setError('El outfit necesita un nombre');
      return;
    }
    setError(null);

    const current: OutfitInput = {
      name: name.trim(),
      head: slots.head[0] ?? null,
      torso: slots.torso,
      legs: slots.legs[0] ?? null,
      feet: slots.feet[0] ?? null,
    };

    let payload: Partial<OutfitInput> = current;
    if (initialValues) {
      payload = {};
      if (current.name !== initialValues.name) payload.name = current.name;
      if (current.head !== initialValues.head) payload.head = current.head;
      if (current.legs !== initialValues.legs) payload.legs = current.legs;
      if (current.feet !== initialValues.feet) payload.feet = current.feet;
      if (JSON.stringify(current.torso) !== JSON.stringify(initialValues.torso)) payload.torso = current.torso;

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
    <ScrollView contentContainerStyle={{ gap: 24, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
      <View className="gap-1.5">
        <Text className="font-body-medium text-ink text-sm">Nombre del outfit</Text>
        <TextInput
          className="font-body bg-ivory rounded-2xl px-4 py-3 text-ink border border-taupe"
          placeholder="Ej. Look casual de viernes"
          placeholderTextColor={COLORS.ink + '80'}
          value={name}
          onChangeText={setName}
          maxLength={60}
        />
      </View>

      {OUTFIT_SLOTS.map((slot) => (
        <OutfitSlotPicker
            key={slot.key}
            label={slot.label}
            garments={wardrobe.filter((garment) => (slot.categories as readonly string[]).includes(garment.category))}
            selectedIds={slots[slot.key]}
            multiple={slot.multiple}
            onChange={(ids) => setSlots((prev) => ({ ...prev, [slot.key]: ids }))}
        />
        ))}

      {!!error && (
        <Text className="font-body text-sm text-red-500 bg-red-50 rounded-2xl p-3 text-center">{error}</Text>
      )}

      <Button label={isSubmitting ? 'Guardando…' : submitLabel} onPress={submit} disabled={isSubmitting} />
    </ScrollView>
  );
}