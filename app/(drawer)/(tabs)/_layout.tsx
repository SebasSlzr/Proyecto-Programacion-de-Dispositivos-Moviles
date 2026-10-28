import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WoodSurface } from '@/components/ui/WoodSurface';
import { COLORS } from '@/constants/theme';
import { useSession } from '@/session/context';

// Alto de la barra sin contar el área segura inferior (la "barra de gestos").
const TAB_BAR_HEIGHT = 58;

export default function TabsLayout() {
  const { user } = useSession();
  const isAdmin = user?.role === 'admin';
  const insets = useSafeAreaInsets();

  // La barra crece hacia abajo lo que mida el área segura, y los íconos
  // quedan por encima de ella.
  const height = TAB_BAR_HEIGHT + insets.bottom;

  // El color puede llegar como ColorValue; si no es texto se usa el activo.
  const iconColor = (color: unknown) => (typeof color === 'string' ? color : COLORS.ivory);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.ivory,
        tabBarInactiveTintColor: COLORS.oakLight,
        tabBarLabelStyle: { fontFamily: 'Manrope_500Medium' },
        tabBarStyle: {
          height,
          paddingTop: 6,
          paddingBottom: insets.bottom + 6,
          borderTopColor: COLORS.walnutDark,
        },
        // WoodSurface toma el alto de su contenido, así que el View vacío le
        // da exactamente el alto de la barra. Solo bisel arriba (el borde que
        // recibe la luz) y sin sombra, porque la barra está pegada al borde.
        tabBarBackground: () => (
          <WoodSurface variant="walnut" bevel="top" shadow={false}>
            <View style={{ height }} />
          </WoodSurface>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Armario',
          tabBarIcon: ({ color, size }) => <Ionicons name="shirt-outline" size={size} color={iconColor(color)} />,
        }}
      />
      <Tabs.Screen
        name="outfits"
        options={{
          title: 'Outfits',
          tabBarIcon: ({ color, size }) => <Ionicons name="sparkles-outline" size={size} color={iconColor(color)} />,
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          title: 'Usuarios',
          // href: null esconde la pestaña de la barra para quien no es admin.
          // Es solo presentación: la protección real es el middleware del backend.
          href: isAdmin ? undefined : null,
          tabBarIcon: ({ color, size }) => <Ionicons name="people-outline" size={size} color={iconColor(color)} />,
        }}
      />
    </Tabs>
  );
}
