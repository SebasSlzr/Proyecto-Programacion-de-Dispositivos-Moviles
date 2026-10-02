import { View, ActivityIndicator } from 'react-native';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ModalHeader } from '@/components/ui/ModalHeader';
import { OutfitForm } from '@/components/outfits/OutfitForm';
import { COLORS } from '@/constants/theme';
import { useEditOutfit } from './useEditOutfit';

export default function EditOutfitScreen() {
  const { wardrobe, isLoading, initialValues, saveOutfit, confirmDelete } = useEditOutfit();

  return (
    <View className="flex-1 bg-linen px-6" style={{ paddingTop: 60 }}>
      <ModalHeader onDelete={confirmDelete} />

      <ScreenHeader title="Editar outfit" subtitle="Ajusta las prendas de este look" />

      <View className="mt-6 flex-1">
        {isLoading ? (
          <ActivityIndicator color={COLORS.plum} style={{ marginTop: 40 }} />
        ) : (
          <OutfitForm
            wardrobe={wardrobe}
            initialValues={initialValues}
            submitLabel="Guardar cambios"
            onSubmit={saveOutfit}
          />
        )}
      </View>
    </View>
  );
}
