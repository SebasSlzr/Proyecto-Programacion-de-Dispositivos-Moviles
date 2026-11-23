import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export type DailyOutfitSettings = { enabled: boolean; hour: number; minute: number };

// SecureStore solo acepta letras, números, ".", "-" y "_" en las claves.
const SETTINGS_KEY = 'percha_daily_outfit';
export const DEFAULT_DAILY_OUTFIT: DailyOutfitSettings = { enabled: false, hour: 7, minute: 30 };

export async function readDailyOutfitSettings(): Promise<DailyOutfitSettings> {
  if (Platform.OS === 'web') return DEFAULT_DAILY_OUTFIT;
  try {
    const guardado = await SecureStore.getItemAsync(SETTINGS_KEY);
    if (!guardado) return DEFAULT_DAILY_OUTFIT;
    return { ...DEFAULT_DAILY_OUTFIT, ...(JSON.parse(guardado) as Partial<DailyOutfitSettings>) };
  } catch {
    return DEFAULT_DAILY_OUTFIT;
  }
}

export async function saveDailyOutfitSettings(settings: DailyOutfitSettings): Promise<void> {
  if (Platform.OS === 'web') return;
  await SecureStore.setItemAsync(SETTINGS_KEY, JSON.stringify(settings));
}