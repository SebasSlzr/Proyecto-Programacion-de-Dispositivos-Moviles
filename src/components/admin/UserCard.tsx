import { Pressable, Text, View } from 'react-native';
import { Badge } from '@/components/ui/Badge';
import type { AdminUser } from '@/types';

type UserCardProps = {
  user: AdminUser;
  onDelete: (user: AdminUser) => void;
};

export function UserCard({ user, onDelete }: UserCardProps) {
  const isAdmin = user.role === 'admin';

  return (
    <View className="bg-ivory rounded-2xl p-4 mb-3 shadow-sm gap-3">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="font-body-bold text-ink text-sm" numberOfLines={1}>
            {user.name}
          </Text>
          <Text className="font-body text-ink/60 text-xs mt-0.5" numberOfLines={1}>
            {user.email}
          </Text>
        </View>
        <Badge label={isAdmin ? 'Administrador' : 'Usuario'} tone={isAdmin ? 'plum' : 'sage'} />
      </View>

      <View className="flex-row items-center justify-between">
        <Text className="font-body text-ink/60 text-xs">
          {user.garmentCount} prendas, {user.outfitCount} outfits
        </Text>
        {/* Los administradores no se pueden eliminar desde el panel (el backend también lo bloquea). */}
        {!isAdmin && (
          <Pressable
            onPress={() => onDelete(user)}
            className="rounded-full px-3 py-1.5 border border-red-300 bg-red-50"
          >
            <Text className="font-body-bold text-red-500 text-xs">Eliminar</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}