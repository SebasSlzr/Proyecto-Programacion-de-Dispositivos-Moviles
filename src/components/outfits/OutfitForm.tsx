import { View, Text, TextInput, ScrollView } from 'react-native';
import { Button } from '@/components/ui/Button';
import { OutfitSlotPicker } from './OutfitSlotPicker';
import { SuggestionBanner } from './SuggestionBanner';
import { useOutfitForm } from './useOutfitForm';
import { useGarmentsBySlot } from './useGarmentsBySlot';
import { useOutfitSuggestion } from './useOutfitSuggestion';
import { OUTFIT_SLOTS } from '@/constants/outfits';
import { STRINGS } from '@/constants/strings';
import { COLORS } from '@/constants/theme';
import type { OutfitInput } from '@/api/outfits';
import type { Garment } from '@/types';

type OutfitFormProps = {
  wardrobe: Garment[];
  initialValues?: OutfitInput; // al editar
  prefill?: OutfitInput;       // outfit nuevo precargado (notificación "Tu outfit de hoy")
  suggestions?: boolean;       // muestra el botón "Sugerir outfit" (en el creador)
  autoSuggest?: boolean;       // aplica una sugerencia al abrir (ruta con suggest = '1')
  onSubmit: (values: Partial<OutfitInput>) => Promise<void>;
  submitLabel: string;
};

export function OutfitForm({
  wardrobe,
  initialValues,
  prefill,
  suggestions = false,
  autoSuggest = false,
  onSubmit,
  submitLabel,
}: OutfitFormProps) {
  const { name, setName, slots, setSlot, applySuggestion, submit, isSubmitting, error } = useOutfitForm({
    initialValues,
    prefill,
    onSubmit,
  });
  const garmentsBySlot = useGarmentsBySlot(wardrobe);
  const suggestion = useOutfitSuggestion(wardrobe, { onSuggest: applySuggestion, autoSuggest });

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

      {suggestions && (
        <View className="gap-3">
          <Button
            variant="secondary"
            label={suggestion.hasSuggested ? STRINGS.outfits.anotherSuggestion : STRINGS.outfits.suggest}
            onPress={suggestion.suggest}
          />
          {suggestion.isBannerVisible &&
            (suggestion.last ? (
              <SuggestionBanner harmony={suggestion.last.harmony} onDismiss={suggestion.dismiss} />
            ) : (
              <Text className="font-body text-sm text-ink bg-ivory border border-taupe rounded-2xl p-3 text-center">
                {STRINGS.outfits.cannotSuggest}
              </Text>
            ))}
        </View>
      )}

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
        <Text className="font-body text-sm text-danger bg-danger-soft rounded-2xl p-3 text-center">{error}</Text>
      )}

      <Button label={isSubmitting ? 'Guardando…' : submitLabel} onPress={submit} disabled={isSubmitting} />
    </ScrollView>
  );
}
