import { useNavigation } from 'expo-router';
import { DrawerActions } from 'expo-router/react-navigation';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { WoodPressable } from './WoodPressable';

// Botón redondo de nogal (44 x 44 px) que abre el drawer del perfil.
export function ProfileButton() {
  const navigation = useNavigation();

  return (
    <WoodPressable
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      radius={22}
      accessibilityLabel="Abrir perfil"
      className="w-11 h-11 items-center justify-center"
    >
      <Ionicons name="person-outline" size={22} color={COLORS.ivory} />
    </WoodPressable>
  );
}
