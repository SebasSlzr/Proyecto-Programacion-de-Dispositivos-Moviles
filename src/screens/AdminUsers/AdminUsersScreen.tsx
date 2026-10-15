import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { StatTile } from '@/components/admin/StatTile';
import { UserCard } from '@/components/admin/UserCard';
import { ListStatus } from '@/components/ui/ListStatus';
import { ProfileButton } from '@/components/ui/ProfileButton';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SearchBar } from '@/components/ui/SearchBar';
import { COLORS } from '@/constants/theme';
import { useAdminUsers } from './useAdminUsers';

export default function AdminUsersScreen() {
  const admin = useAdminUsers();

  return (
    <ScrollView
      className="flex-1 bg-linen"
      contentContainerStyle={{ padding: 20, paddingTop: 60, flexGrow: 1 }}
      refreshControl={
        <RefreshControl refreshing={admin.isRefreshing} onRefresh={admin.onRefresh} tintColor={COLORS.plum} />
      }
    >
      <View className="flex-row items-start justify-between">
        <ScreenHeader title="Usuarios" subtitle="Panel de administración" />
        <ProfileButton />
      </View>

      <View className="mt-5 gap-3">
        <View className="flex-row gap-3">
          <StatTile label="Usuarios" value={admin.totals.users} />
          <StatTile label="Prendas" value={admin.totals.garments} />
          <StatTile label="Outfits" value={admin.totals.outfits} />
        </View>
        <SearchBar value={admin.search} onChangeText={admin.setSearch} placeholder="Buscar por nombre o correo…" />
        {!!admin.actionError && (
          <Text className="font-body text-sm text-red-500 bg-red-50 rounded-2xl p-3 text-center">
            {admin.actionError}
          </Text>
        )}
      </View>

      <ListStatus
        isLoading={admin.isLoading}
        error={admin.error}
        isEmpty={admin.filteredUsers.length === 0}
        emptyTitle="Sin resultados"
        emptyDescription="No hay usuarios que coincidan con tu búsqueda."
      >
        <View className="mt-4">
          {admin.filteredUsers.map((user) => (
            <UserCard key={user.id} user={user} onDelete={admin.confirmDelete} />
          ))}
        </View>
      </ListStatus>
    </ScrollView>
  );
}