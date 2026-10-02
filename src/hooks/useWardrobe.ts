import { useEffect, useState } from 'react';
import { listGarments } from '@/api/garments';
import type { Garment } from '@/types';

// Prendas del usuario, para elegirlas al armar un outfit.
export function useWardrobe() {
  const [wardrobe, setWardrobe] = useState<Garment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    listGarments()
      .then((data) => setWardrobe(data.garments))
      .finally(() => setIsLoading(false));
  }, []);

  return { wardrobe, isLoading };
}
