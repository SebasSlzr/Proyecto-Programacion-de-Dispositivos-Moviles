import '../global.css';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SessionProvider, useSession } from '@/session/context';
import { useAppFonts } from '@/hooks/useAppFonts';

// El SessionProvider va afuera de todo para que la restauración de la
// sesión empiece de inmediato, al mismo tiempo que se cargan las fuentes.
export default function RootLayout() {
  return (
    <SessionProvider>
      <Navigator />
    </SessionProvider>
  );
}

function Navigator() {
  const { user, isRestoring } = useSession();
  const isReady = useAppFonts(!isRestoring);

  // Mientras no esté listo, el splash sigue visible encima.
  if (!isReady) return null;

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={!!user} redirectTo="/login">
          <Stack.Screen name="(drawer)" />
          <Stack.Screen name="garment/new" options={{ presentation: 'modal' }} />
          <Stack.Screen name="garment/[id]" options={{ presentation: 'modal' }} />
          <Stack.Screen name="outfit/new" options={{ presentation: 'modal' }} />
          <Stack.Screen name="outfit/[id]" options={{ presentation: 'modal' }} />
        </Stack.Protected>

        <Stack.Protected guard={!user}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
      </Stack>
    </>
  );
}
