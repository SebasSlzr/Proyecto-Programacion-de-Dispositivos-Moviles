import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { ProfileDrawerContent } from '@/components/profile/ProfileDrawerContent';
import { COLORS } from '@/constants/theme';
import { STRINGS } from '@/constants/strings';

// Drawer del rol administrador: el mismo panel de perfil que usa el rol usuario,
// envolviendo el panel de usuarios.
export default function AdminDrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <ProfileDrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          drawerType: 'front',
          drawerPosition: 'right',
          swipeEnabled: false,
          drawerStyle: { backgroundColor: COLORS.linen, width: '85%' },
          overlayColor: COLORS.overlay,
          title: STRINGS.admin.panel,
        }}
      >
        <Drawer.Screen name="(panel)" />
      </Drawer>
    </GestureHandlerRootView>
  );
}