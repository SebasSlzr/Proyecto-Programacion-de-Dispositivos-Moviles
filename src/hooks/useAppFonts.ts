import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { Fraunces_400Regular } from '@expo-google-fonts/fraunces/400Regular';
import { Fraunces_600SemiBold } from '@expo-google-fonts/fraunces/600SemiBold';
import { Manrope_400Regular } from '@expo-google-fonts/manrope/400Regular';
import { Manrope_500Medium } from '@expo-google-fonts/manrope/500Medium';
import { Manrope_700Bold } from '@expo-google-fonts/manrope/700Bold';

SplashScreen.preventAutoHideAsync();

// Carga las fuentes de la app y mantiene la pantalla de carga (splash) hasta
// que todo esté listo: las fuentes y, además, lo que indique `isAppReady`
// (en el layout raíz: que ya terminó de restaurarse la sesión). Así no se ve
// un destello del login antes de entrar directo al armario.
export function useAppFonts(isAppReady = true) {
  const [fontsLoaded] = useFonts({
    Fraunces_400Regular,
    Fraunces_600SemiBold,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_700Bold,
  });

  const isReady = fontsLoaded && isAppReady;

  useEffect(() => {
    if (isReady) SplashScreen.hideAsync();
  }, [isReady]);

  return isReady;
}
