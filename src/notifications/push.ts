import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { savePushToken } from '@/api/users';
import { ensureNotificationChannel } from './channel';

// Obtiene el token push SOLO si el permiso ya fue concedido: este módulo nunca pide permiso
// (eso lo hace la pantalla de Recordatorios, explicando para qué sirve).
async function getPushTokenIfAllowed(): Promise<string | null> {
  if (Platform.OS === 'web') return null;
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') return null;

  await ensureNotificationChannel();
  const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
  if (!projectId) throw new Error('Falta extra.eas.projectId en app.json');

  const { data } = await Notifications.getExpoPushTokenAsync({ projectId });
  return data;
}

// Si algo falla (Expo Go en Android, sin red, backend dormido), la app sigue funcionando
// sin avisos push. Nunca se imprime el token: identifica el teléfono.
export async function registerPushTokenIfAllowed(): Promise<void> {
  try {
    const token = await getPushTokenIfAllowed();
    if (token) await savePushToken(token);
  } catch (error) {
    console.warn('Notificaciones push no disponibles:', (error as Error).message);
  }
}

// Se llama ANTES de cerrar sesión: después ya no hay token de sesión para hacer la petición.
export async function unregisterPushToken(): Promise<void> {
  try {
    await savePushToken(null);
  } catch {
    // Sin red se cierra sesión igual; el servidor limpia tokens inválidos al enviar.
  }
}

export function usePushRegistration(signedIn: boolean): void {
  useEffect(() => {
    if (signedIn) registerPushTokenIfAllowed();
  }, [signedIn]);
}