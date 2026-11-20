import { View, ActivityIndicator } from 'react-native';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ModalHeader } from '@/components/ui/ModalHeader';
import { OutfitForm } from '@/components/outfits/OutfitForm';
import { COLORS } from '@/constants/theme';
import { useNewOutfit } from './useNewOutfit';

export default function NewOutfitScreen() {
  const { wardrobe, isLoading, prefill, autoSuggest, saveOutfit } = useNewOutfit();

  return (
    <View className="flex-1 bg-linen px-6" style={{ paddingTop: 60 }}>
      <ModalHeader />

      <ScreenHeader title="Nuevo outfit" subtitle="Combina prendas de tu armario" />

      <View className="mt-6 flex-1">
        {isLoading ? (
          <ActivityIndicator color={COLORS.walnut} style={{ marginTop: 40 }} />
        ) : (
          <OutfitForm
            wardrobe={wardrobe}
            prefill={prefill}
            suggestions
            autoSuggest={autoSuggest}
            submitLabel="Guardar outfit"
            onSubmit={saveOutfit}
          />
        )}
      </View>
    </View>
  );
}
