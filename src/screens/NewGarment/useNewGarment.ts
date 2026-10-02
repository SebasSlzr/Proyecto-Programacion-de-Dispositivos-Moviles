import { router } from 'expo-router';
import { createGarment, type GarmentInput } from '@/api/garments';

// Crea la prenda y cierra el modal.
export function useNewGarment() {
  const saveGarment = async (values: Partial<GarmentInput>) => {
    await createGarment(values as GarmentInput);
    router.back();
  };

  return { saveGarment };
}
