import { router, useLocalSearchParams } from 'expo-router';
import { updateGarment, deleteGarment, type GarmentInput } from '@/api/garments';
import { useConfirmAction } from '@/hooks/useConfirmAction';

// Todos los parámetros de ruta llegan como texto; '' significa "no tiene".
type GarmentParams = {
  id: string;
  name: string;
  category: string;
  color: string;
  swatchColor: string;
  imageUrl: string;
  imagePublicId: string;
};

// Lee la prenda desde los parámetros de la ruta y expone guardar y eliminar.
export function useEditGarment() {
  const params = useLocalSearchParams<GarmentParams>();
  const { confirm } = useConfirmAction();

  const initialValues: GarmentInput = {
    name: params.name,
    category: params.category,
    color: params.color,
    swatchColor: params.swatchColor,
    // La foto viaja como texto: si llega vacía, la prenda no tiene foto (null).
    imageUrl: params.imageUrl || null,
    imagePublicId: params.imagePublicId || null,
  };

  const saveGarment = async (values: Partial<GarmentInput>) => {
    await updateGarment(params.id, values);
    router.back();
  };

  const confirmDelete = () => {
    confirm({
      title: 'Eliminar prenda',
      message: 'Esta acción no se puede deshacer.',
      onConfirm: async () => {
        await deleteGarment(params.id);
        router.back();
      },
    });
  };

  return { initialValues, saveGarment, confirmDelete };
}
