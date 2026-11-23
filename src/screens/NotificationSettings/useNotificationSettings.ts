import { useEffect, useState } from 'react';
import { AppState, Linking, Platform } from 'react-native';
import { updateMe } from '@/api/users';
import { STRINGS } from '@/constants/strings';
import {
  DEFAULT_DAILY_OUTFIT,
  readDailyOutfitSettings,
  saveDailyOutfitSettings,
  type DailyOutfitSettings,
} from '@/notifications/dailyOutfitSettings';
import {
  getNotificationPermission,
  requestNotificationPermission,
  type NotificationPermission,
} from '@/notifications/permissions';
import { registerPushTokenIfAllowed } from '@/notifications/push';
import { syncDailyOutfits } from '@/notifications/useDailyOutfitScheduler';
import { useSession } from '@/session/context';

const TEXTS = STRINGS.notifications;

// "mañana a las 7:30": la misma regla que proximasFechas (si ya pasó la hora, es mañana).
function proximoAviso({ hour, minute }: DailyOutfitSettings): string {
  const ahora = new Date();
  const hoyAEsaHora = new Date(ahora);
  hoyAEsaHora.setHours(hour, minute, 0, 0);
  const dia = hoyAEsaHora > ahora ? TEXTS.today : TEXTS.tomorrow;
  return TEXTS.nextNotice(dia, `${hour}:${String(minute).padStart(2, '0')}`);
}

export function useNotificationSettings() {
  const { user, updateUser } = useSession();
  const [permission, setPermission] = useState<NotificationPermission | 'undetermined' | null>(null);
  const [daily, setDaily] = useState<DailyOutfitSettings>(DEFAULT_DAILY_OUTFIT);
  const [scheduled, setScheduled] = useState<number | null>(null); // 0 = faltan prendas
  const [isSavingWishlist, setIsSavingWishlist] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Al abrir: el permiso y lo que había elegido. Al volver de Ajustes, se revisa otra vez el permiso.
  useEffect(() => {
    Promise.all([getNotificationPermission(), readDailyOutfitSettings()]).then(([actual, guardado]) => {
      setPermission(actual);
      setDaily(guardado);
    });
    const suscripcion = AppState.addEventListener('change', (estado) => {
      if (estado === 'active') getNotificationPermission().then(setPermission);
    });
    return () => suscripcion.remove();
  }, []);

  // Guarda la preferencia y reprograma: así "cambiar la hora reprograma" y "desactivar cancela".
  const applyDaily = async (next: DailyOutfitSettings) => {
    setDaily(next);
    setError(null);
    try {
      await saveDailyOutfitSettings(next);
      setScheduled(await syncDailyOutfits());
    } catch {
      setError(TEXTS.saveError);
    }
  };

  // Permiso en contexto: se pide solo cuando la persona toca "Activar", después de leer para qué es.
  const askPermission = async () => {
    const result = await requestNotificationPermission();
    setPermission(result);
    if (result === 'granted') {
      registerPushTokenIfAllowed(); // contrato de Sebas: ya hay permiso, se registra el token push
      await applyDaily({ ...daily, enabled: true });
    }
  };

  const changeTime = (campo: 'hour' | 'minute', paso: 1 | -1) => {
    const next =
      campo === 'hour'
        ? { ...daily, hour: (daily.hour + paso + 24) % 24 }
        : { ...daily, minute: (daily.minute + paso + 60) % 60 };
    applyDaily(next);
  };

  // La preferencia de la wishlist vive en el servidor: la usa el job que envía las push.
  const toggleWishlist = async (wishlistReminders: boolean) => {
    setIsSavingWishlist(true);
    setError(null);
    try {
      const { user: updated } = await updateMe({ wishlistReminders });
      updateUser(updated);
    } catch {
      setError(TEXTS.saveError);
    } finally {
      setIsSavingWishlist(false);
    }
  };

  return {
    isSupported: Platform.OS !== 'web',
    permission,
    daily,
    nextNotice: proximoAviso(daily),
    notEnoughGarments: daily.enabled && scheduled === 0,
    wishlistReminders: user?.wishlistReminders ?? false,
    isSavingWishlist,
    error,
    askPermission,
    toggleDaily: (enabled: boolean) => applyDaily({ ...daily, enabled }),
    changeTime,
    toggleWishlist,
    openSettings: () => Linking.openSettings(),
  };
}