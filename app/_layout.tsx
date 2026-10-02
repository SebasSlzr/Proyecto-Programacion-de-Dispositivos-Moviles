import '../global.css';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SessionProvider, useSession } from '@/session/context';
import { useAppFonts } from '@/hooks/useAppFonts';

export default function RootLayout() {
  const fontsLoaded = useAppFonts();

  if (!fontsLoaded) return null;

  return (
    <SessionProvider>
      <StatusBar style="dark" />
      <Navigator />
    </SessionProvider>
  );
}

function Navigator() {
  const { user } = useSession();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!!user}>
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
  );
}
