import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Badge } from '@/components/ui/Badge';
import { STRINGS } from '@/constants/strings';
import { COLORS } from '@/constants/theme';
import { getInitials } from '@/utils/initials';
import type { AdminUser } from '@/types';

type UserCardProps = {
  user: AdminUser;
  onPress: (user: AdminUser) => void;   // abrir el detalle (prendas y outfits en solo lectura)
  onDelete: (user: AdminUser) => void;  // pedir confirmación para eliminar la cuenta
};

// Tarjeta de un usuario en el panel:
// - Avatar con sus iniciales (plum para administradores, sage para usuarios), nombre, correo y rol.
// - Toda la tarjeta se puede tocar y la flecha (chevron) lo indica. Al presionar baja 1 px.
// - "Eliminar" es un botón aparte dentro de la tarjeta; solo aparece para usuarios,
//   porque un administrador no se puede eliminar (el backend también lo bloquea).
export function UserCard({ user, onPress, onDelete }: UserCardProps) {
  const isAdmin = user.role === 'admin';
  const roleLabel = isAdmin ? STRINGS.admin.roleAdmin : STRINGS.admin.roleUser;
  const counts = `${user.garmentCount} ${user.garmentCount === 1 ? 'prenda' : 'prendas'}, ${user.outfitCount} ${
    user.outfitCount === 1 ? 'outfit' : 'outfits'
  }`;

  return (
    <Pressable
      onPress={() => onPress(user)}
      accessibilityRole="button"
      accessibilityLabel={`${user.name}, ${roleLabel}, ${counts}`}
      accessibilityHint={STRINGS.admin.openUserHint}
      className="bg-ivory rounded-2xl border border-taupe p-4 mb-3 shadow-sm gap-3 active:opacity-85 active:translate-y-px"
    >
      <View className="flex-row items-center gap-3">
        <View
          className={`w-12 h-12 rounded-full items-center justify-center ${isAdmin ? 'bg-plum' : 'bg-sage-dark'}`}
        >
          <Text className="font-body-bold text-ivory text-base">{getInitials(user.name)}</Text>
        </View>

        <View className="flex-1">
          <Text className="font-body-bold text-ink text-sm" numberOfLines={1}>
            {user.name}
          </Text>
          <Text className="font-body text-ink-muted text-xs mt-0.5" numberOfLines={1}>
            {user.email}
          </Text>
        </View>

        <Ionicons name="chevron-forward" size={20} color={COLORS.inkMuted} />
      </View>

      <View className="flex-row items-center justify-between gap-2">
        <View className="flex-row items-center gap-2 flex-shrink">
          <Badge label={roleLabel} tone={isAdmin ? 'plum' : 'sage'} />
          <Text className="font-body text-ink-muted text-xs flex-shrink" numberOfLines={1}>
            {counts}
          </Text>
        </View>
        {!isAdmin && (
          <Pressable
            onPress={() => onDelete(user)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel={`${STRINGS.admin.deleteUser} ${user.name}`}
            className="rounded-full px-3 py-1.5 border border-danger-border bg-danger-soft active:opacity-85"
          >
            <Text className="font-body-bold text-danger text-xs">{STRINGS.admin.delete}</Text>
          </Pressable>
        )}
      </View>
    </Pressable>
  );
}
