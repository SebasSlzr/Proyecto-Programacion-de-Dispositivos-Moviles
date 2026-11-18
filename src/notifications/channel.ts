import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export const NOTIFICATION_CHANNEL_ID = 'default';

// Datos que lleva TODA notificación de Percha (local o push). El observador solo lee esto.
export type PerchaNotificationData = {
  kind: 'daily-outfit' | 'wishlist-reminder';
  url: string;                       // ruta a abrir: '/outfit/new' o '/wishlist/<id>'
  params?: Record<string, string>;   // parámetros de ruta
};

// Android 13 o superior: el canal debe existir ANTES de pedir el permiso,
// o el diálogo de permiso no aparece. En iOS no hace nada.
export async function ensureNotificationChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNEL_ID, {
    name: 'Recordatorios de Percha',
    importance: Notifications.AndroidImportance.HIGH,
  });
}