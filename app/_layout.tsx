import '../global.css';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SessionProvider, useSession } from '@/session/context';
import { useAppFonts } from '@/hooks/useAppFonts';
import { ConfirmDialogProvider } from '@/context/ConfirmDialogContext';
import { type Href } from 'expo-router';
import { useNotificationObserver } from '@/notifications/useNotificationObserver';
import { usePushRegistration } from '@/notifications/push';

// El SessionProvider va afuera de todo para que la restauración de la
// sesión empiece de inmediato, al mismo tiempo que se cargan las fuentes.
export default function RootLayout() {
  return (
    <SessionProvider>
      <ConfirmDialogProvider>
        <Navigator />
      </ConfirmDialogProvider>
    </SessionProvider>
  );
}

function Navigator() {
  const { user, isRestoring } = useSession();
  const isUser = user?.role === 'user';
  const isAdmin = user?.role === 'admin';

  // Pantalla de inicio de cada rol: a donde va quien entra a una ruta que no le corresponde.
  const home: Href = !user ? '/login' : isAdmin ? '/users' : '/';

  usePushRegistration(!!user);
  useNotificationObserver(!isRestoring && !!user);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!user} redirectTo={home}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>

      <Stack.Protected guard={isUser} redirectTo={home}>
        <Stack.Screen name="(drawer)" />
        <Stack.Screen name="garment/new" options={{ presentation: 'modal' }} />
        <Stack.Screen name="garment/[id]" options={{ presentation: 'modal' }} />
        <Stack.Screen name="outfit/new" options={{ presentation: 'modal' }} />
        <Stack.Screen name="outfit/[id]" options={{ presentation: 'modal' }} />
        <Stack.Screen name="wishlist/new" options={{ presentation: 'modal' }} />
        <Stack.Screen name="wishlist/[id]" options={{ presentation: 'modal' }} />
        <Stack.Screen name="settings/notifications" />
      </Stack.Protected>

      <Stack.Protected guard={isAdmin} redirectTo={home}>
        <Stack.Screen name="(admin)" />
      </Stack.Protected>

      {/* Sin guard: se abre con y sin sesión (enlace desde el registro y desde el drawer). */}
      <Stack.Screen name="privacy" />
    </Stack>
  );
}
