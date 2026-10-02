import { router } from 'expo-router';
import { createOutfit, type OutfitInput } from '@/api/outfits';
import { useWardrobe } from '@/hooks/useWardrobe';

// Carga el armario para elegir prendas, crea el outfit y cierra el modal.
export function useNewOutfit() {
  const { wardrobe, isLoading } = useWardrobe();

  const saveOutfit = async (values: Partial<OutfitInput>) => {
    await createOutfit(values as OutfitInput);
    router.back();
  };

  return { wardrobe, isLoading, saveOutfit };
}
