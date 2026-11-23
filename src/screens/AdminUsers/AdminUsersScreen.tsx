import { RefreshControl, SectionList, Text, View } from 'react-native';
import { StatTile } from '@/components/admin/StatTile';
import { UserCard } from '@/components/admin/UserCard';
import { ListStatus } from '@/components/ui/ListStatus';
import { SearchBar } from '@/components/ui/SearchBar';
import { WoodHeader } from '@/components/ui/WoodHeader';
import { STRINGS } from '@/constants/strings';
import { COLORS } from '@/constants/theme';
import { useAdminUsers } from './useAdminUsers';

// Panel del administrador con la misma estructura que el armario: encabezado de
// madera fijo (así el rol usuario y el administrador se ven como la misma app) y
// debajo una SectionList, que como FlatList solo dibuja lo visible pero agrupa
// en secciones. Estadísticas y búsqueda van en ListHeaderComponent y los estados
// de carga, error y vacío en ListEmptyComponent.
export default function AdminUsersScreen() {
  const admin = useAdminUsers();

  return (
    <View className="flex-1 bg-linen">
      <WoodHeader title={STRINGS.admin.panel} subtitle={STRINGS.admin.panelSubtitle} />

      <SectionList
        sections={admin.sections}
        keyExtractor={(user) => user.id}
        contentContainerStyle={{ padding: 20, paddingBottom: 32, flexGrow: 1 }}
        stickySectionHeadersEnabled={false}
        renderItem={({ item }) => (
          <UserCard user={item} onPress={admin.openUser} onDelete={admin.confirmDelete} />
        )}
        renderSectionHeader={({ section }) => (
          <Text
            accessibilityRole="header"
            className="font-body-bold text-ink-muted text-xs uppercase tracking-wider mt-2 mb-2"
          >
            {section.title} ({section.data.length})
          </Text>
        )}
        ListHeaderComponent={
          <View className="gap-3 mb-4">
            <View className="flex-row gap-3">
              <StatTile label={STRINGS.admin.statUsers} value={admin.totals.users} icon="people-outline" />
              <StatTile label={STRINGS.admin.statGarments} value={admin.totals.garments} icon="shirt-outline" />
              <StatTile label={STRINGS.admin.statOutfits} value={admin.totals.outfits} icon="layers-outline" />
            </View>
            <SearchBar value={admin.search} onChangeText={admin.setSearch} placeholder={STRINGS.admin.search} />
            {!!admin.actionError && (
              <Text className="font-body text-sm text-danger bg-danger-soft rounded-2xl p-3 text-center">
                {admin.actionError}
              </Text>
            )}
          </View>
        }
        ListEmptyComponent={
          <ListStatus
            isLoading={admin.isLoading}
            error={admin.error}
            isEmpty
            emptyTitle={STRINGS.admin.emptyTitle}
            emptyDescription={STRINGS.admin.emptyDescription}
          />
        }
        refreshControl={
          <RefreshControl refreshing={admin.isRefreshing} onRefresh={admin.onRefresh} tintColor={COLORS.walnut} />
        }
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      />
    </View>
  );
}
