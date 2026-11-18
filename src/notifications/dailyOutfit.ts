import type { Garment } from '@/types';

// Esqueleto de la Fase 0 V2: Castri programa aquí "Tu outfit de hoy". La firma no cambia.
export async function scheduleDailyOutfits(_wardrobe: Garment[], _hour: number, _minute: number): Promise<number> {
  return 0;
}

export async function cancelDailyOutfits(): Promise<void> {}