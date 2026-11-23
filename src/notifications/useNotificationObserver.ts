import * as Notifications from 'expo-notifications';
import { useRouter, type Href } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import type { PerchaNotificationData } from './channel';

// Primer plano: sin esto, una notificación que llega con la app abierta no se ve.
if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

// Solo se navega a rutas internas ("/..."), aunque la push venga del servidor.
function destinoDe(respuesta: Notifications.NotificationResponse): PerchaNotificationData | null {
  const data = respuesta.notification.request.content.data as Partial<PerchaNotificationData> | undefined;
  if (!data?.kind || typeof data.url !== 'string' || !data.url.startsWith('/')) return null;
  return { kind: data.kind, url: data.url, params: data.params };
}

// Navega al tocar una notificación (local o push), también si la app estaba cerrada.
// Si todavía no hay sesión (ready falso), guarda el destino y navega en cuanto la haya.
export function useNotificationObserver(ready: boolean): void {
  const router = useRouter();
  const [pendiente, setPendiente] = useState<PerchaNotificationData | null>(null);
  const ultimaAtendida = useRef<string | null>(null);

  useEffect(() => {
    if (Platform.OS === 'web') return;

    const alTocar = (respuesta: Notifications.NotificationResponse) => {
      const id = respuesta.notification.request.identifier;
      if (id === ultimaAtendida.current) return; // la misma no se abre dos veces
      ultimaAtendida.current = id;
      const destino = destinoDe(respuesta);
      if (destino) setPendiente(destino);
    };

    const alArrancar = Notifications.getLastNotificationResponse(); // la app estaba cerrada
    if (alArrancar) alTocar(alArrancar);

    const suscripcion = Notifications.addNotificationResponseReceivedListener(alTocar);
    return () => suscripcion.remove();
  }, []);

  useEffect(() => {
    if (!ready || !pendiente) return;
    router.push({ pathname: pendiente.url, params: pendiente.params ?? {} } as Href);
    Notifications.clearLastNotificationResponse(); // para no reabrirla en el próximo inicio
    setPendiente(null);
  }, [ready, pendiente, router]);
}