import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { ProfileDrawerContent } from '@/components/profile/ProfileDrawerContent';
import { COLORS } from '@/constants/theme';
import { STRINGS } from '@/constants/strings';

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
          overlayColor: COLORS.overlay,
          title: STRINGS.tabs.wardrobe,
        }}
      >
        <Drawer.Screen name="(tabs)" />
      </Drawer>
    </GestureHandlerRootView>
  );
}