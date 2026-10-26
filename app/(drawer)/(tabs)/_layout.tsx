import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { COLORS } from '@/constants/theme';
import { useSession } from '@/session/context';

export default function TabsLayout() {
  const { user } = useSession();
  const isAdmin = user?.role === 'admin';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.plum,
        tabBarInactiveTintColor: COLORS.taupe,
        tabBarStyle: { backgroundColor: COLORS.ivory, borderTopColor: COLORS.taupe },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Armario',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="shirt-outline" size={size} color={typeof color === 'string' ? color : COLORS.plum} />
          ),
        }}
      />
      <Tabs.Screen
        name="outfits"
        options={{
          title: 'Outfits',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="sparkles-outline" size={size} color={typeof color === 'string' ? color : COLORS.plum} />
          ),
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          title: 'Usuarios',
          // href: null esconde la pestaña de la barra para quien no es admin.
          // Es solo presentación: la protección real es el middleware del backend.
          href: isAdmin ? undefined : null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={typeof color === 'string' ? color : COLORS.plum} />
          ),
        }}
      />
    </Tabs>
  );
}