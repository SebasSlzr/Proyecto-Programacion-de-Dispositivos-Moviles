import { Pressable } from 'react-native';
import { useNavigation } from 'expo-router';
import { DrawerActions } from 'expo-router/react-navigation';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';

// Botón redondo que abre el drawer del perfil.
export function ProfileButton() {
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      className="bg-plum rounded-full w-11 h-11 items-center justify-center"
    >
      <Ionicons name="person-outline" size={22} color={COLORS.ivory} />
    </Pressable>
  );
}
