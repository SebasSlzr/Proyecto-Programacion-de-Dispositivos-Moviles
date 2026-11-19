import { useEffect, useState } from 'react';
import { sugerirOutfit, type OutfitSuggestion } from '@/utils/suggestOutfit';
import type { Garment } from '@/types';

type UseOutfitSuggestionOptions = {
  onSuggest?: (suggestion: OutfitSuggestion) => void; // qué hacer con una sugerencia válida (llenar el formulario)
  autoSuggest?: boolean;                               // sugerir apenas se abre (ruta con suggest = '1')
};

// Pide sugerencias a sugerirOutfit sin repetir el ancla de la anterior, para que
// "Otra sugerencia" se sienta distinta. Guarda la última para mostrar el banner.
export function useOutfitSuggestion(wardrobe: Garment[], { onSuggest, autoSuggest = false }: UseOutfitSuggestionOptions = {}) {
  const [last, setLast] = useState<OutfitSuggestion | null>(null);
  const [hasSuggested, setHasSuggested] = useState(false);
  const [isBannerVisible, setIsBannerVisible] = useState(false);

  const suggest = (): OutfitSuggestion | null => {
    const excluir = last ? [last.anchorId] : [];
    // Con un armario pequeño puede que solo haya un ancla posible: entonces se intenta sin excluir.
    const next = sugerirOutfit(wardrobe, { excluir }) ?? sugerirOutfit(wardrobe);
    setLast(next);
    setHasSuggested(true);
    setIsBannerVisible(true);
    if (next) onSuggest?.(next);
    return next;
  };

  const dismiss = () => setIsBannerVisible(false);

  // Solo al montar: el formulario se dibuja cuando el armario ya está cargado.
  useEffect(() => {
    if (autoSuggest) suggest();
  }, []);

  return { suggest, last, hasSuggested, isBannerVisible, dismiss };
}
