import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { ProfileDrawerContent } from '../../src/components/ui/ProfileDrawerContent';
import { COLORS } from '../../src/constants/theme';

export default function DrawerLayout() {
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
          overlayColor: 'rgba(43, 38, 33, 0.4)',
        }}
      >
        <Drawer.Screen name="(tabs)" />
      </Drawer>
    </GestureHandlerRootView>
  );
}