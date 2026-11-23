import { useEffect } from 'react';
import { AppState } from 'react-native';
import { listGarments } from '@/api/garments';
import { cancelDailyOutfits, scheduleDailyOutfits } from './dailyOutfit';
import { readDailyOutfitSettings } from './dailyOutfitSettings';
import { getNotificationPermission } from './permissions';

// Siempre con el armario de AHORA, así una prenda borrada ya no sale.
async function reprogramar(): Promise<number> {
  const settings = await readDailyOutfitSettings();
  if (!settings.enabled || (await getNotificationPermission()) !== 'granted') {
    await cancelDailyOutfits();
    return 0;
  }
  const { garments } = await listGarments();
  return scheduleDailyOutfits(garments, settings.hour, settings.minute);
}

// En fila: si se piden dos a la vez (login + volver a la app), la segunda espera a la primera
// y nunca quedan avisos duplicados.
let fila: Promise<unknown> = Promise.resolve();

export function syncDailyOutfits(): Promise<number> {
  const turno = fila.then(reprogramar);
  fila = turno.catch(() => {});
  return turno;
}

// Reprograma al iniciar sesión y cada vez que la app vuelve a primer plano.
export function useDailyOutfitScheduler(signedIn: boolean): void {
  useEffect(() => {
    if (!signedIn) return;
    syncDailyOutfits().catch(() => {});

    const suscripcion = AppState.addEventListener('change', (estado) => {
      if (estado === 'active') syncDailyOutfits().catch(() => {});
    });
    return () => suscripcion.remove();
  }, [signedIn]);
}