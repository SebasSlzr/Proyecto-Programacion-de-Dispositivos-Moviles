import { View, Text, TextInput, ScrollView } from 'react-native';
import { Button } from '@/components/ui/Button';
import { OutfitSlotPicker } from './OutfitSlotPicker';
import { useOutfitForm } from './useOutfitForm';
import { useGarmentsBySlot } from './useGarmentsBySlot';
import { OUTFIT_SLOTS } from '@/constants/outfits';
import { COLORS } from '@/constants/theme';
import type { OutfitInput } from '@/api/outfits';
import type { Garment } from '@/types';

type OutfitFormProps = {
  wardrobe: Garment[];
  initialValues?: OutfitInput;
  onSubmit: (values: Partial<OutfitInput>) => Promise<void>;
  submitLabel: string;
};

export function OutfitForm({ wardrobe, initialValues, onSubmit, submitLabel }: OutfitFormProps) {
  const { name, setName, slots, setSlot, submit, isSubmitting, error } = useOutfitForm({
    initialValues,
    onSubmit,
  });
  const garmentsBySlot = useGarmentsBySlot(wardrobe);

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
          garments={garmentsBySlot[slot.key]}
          selectedIds={slots[slot.key]}
          multiple={slot.multiple}
          onChange={(ids) => setSlot(slot.key, ids)}
        />
      ))}

      {!!error && (
        <Text className="font-body text-sm text-red-500 bg-red-50 rounded-2xl p-3 text-center">{error}</Text>
      )}

      <Button label={isSubmitting ? 'Guardando…' : submitLabel} onPress={submit} disabled={isSubmitting} />
    </ScrollView>
  );
}