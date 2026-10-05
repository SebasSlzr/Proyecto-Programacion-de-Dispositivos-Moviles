import { Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { updateGarment, deleteGarment, type GarmentInput } from '@/api/garments';

type GarmentParams = { id: string; name: string; category: string; color: string; swatchColor: string };

// Lee la prenda desde los parámetros de la ruta y expone guardar y eliminar.
export function useEditGarment() {
  const params = useLocalSearchParams<GarmentParams>();

  const initialValues = {
    name: params.name,
    category: params.category,
    color: params.color,
    swatchColor: params.swatchColor,
  };

  const saveGarment = async (values: Partial<GarmentInput>) => {
    await updateGarment(params.id, values);
    router.back();
  };

  const confirmDelete = () => {
    Alert.alert('Eliminar prenda', 'Esta acción no se puede deshacer.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          await deleteGarment(params.id);
          router.back();
        },
      },
    ]);
  };

  return { initialValues, saveGarment, confirmDelete };
}
