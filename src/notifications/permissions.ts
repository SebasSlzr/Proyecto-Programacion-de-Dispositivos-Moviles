import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { ensureNotificationChannel } from './channel';

export type NotificationPermission = 'granted' | 'denied' | 'blocked';

// Bloqueado = el sistema ya no vuelve a mostrar el diálogo; solo se activa desde Ajustes.
function toPermission(
  result: Notifications.NotificationPermissionsStatus,
): NotificationPermission | 'undetermined' {
  if (result.status === 'granted') return 'granted';
  if (result.status === 'undetermined') return 'undetermined';
  return result.canAskAgain ? 'denied' : 'blocked';
}

// Solo consulta: nunca muestra el diálogo.
export async function getNotificationPermission(): Promise<NotificationPermission | 'undetermined'> {
  if (Platform.OS === 'web') return 'denied';
  return toPermission(await Notifications.getPermissionsAsync());
}

// Android 13+: el canal se crea ANTES de pedir el permiso, o el diálogo no aparece.
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (Platform.OS === 'web') return 'denied';
  await ensureNotificationChannel();

  const current = toPermission(await Notifications.getPermissionsAsync());
  if (current === 'granted' || current === 'blocked') return current;

  const asked = toPermission(await Notifications.requestPermissionsAsync());
  return asked === 'undetermined' ? 'denied' : asked;
}