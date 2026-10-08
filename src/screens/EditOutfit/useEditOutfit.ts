import { router, useLocalSearchParams } from 'expo-router';
import { updateOutfit, deleteOutfit, type OutfitInput } from '@/api/outfits';
import { useConfirmAction } from '@/hooks/useConfirmAction';
import { useWardrobe } from '@/hooks/useWardrobe';

type OutfitParams = { id: string; name: string; head: string; legs: string; feet: string; torso: string };

// Reconstruye el outfit desde los parámetros de la ruta y expone guardar y eliminar.
export function useEditOutfit() {
  const params = useLocalSearchParams<OutfitParams>();
  const { wardrobe, isLoading } = useWardrobe();
  const { confirm } = useConfirmAction();

  const initialValues: OutfitInput = {
    name: params.name,
    head: params.head || null,
    legs: params.legs || null,
    feet: params.feet || null,
    torso: params.torso ? JSON.parse(params.torso) : [],
  };

  const saveOutfit = async (values: Partial<OutfitInput>) => {
    await updateOutfit(params.id, values);
    router.back();
  };

  const confirmDelete = () => {
    confirm({
      title: 'Eliminar outfit',
      message: 'Esta acción no se puede deshacer.',
      onConfirm: async () => {
        await deleteOutfit(params.id);
        router.back();
      },
    });
  };

  return { wardrobe, isLoading, initialValues, saveOutfit, confirmDelete };
}
