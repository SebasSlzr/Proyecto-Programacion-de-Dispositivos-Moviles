import { FlatList, RefreshControl, Text, View } from 'react-native';
import { AddButton } from '@/components/ui/AddButton';
import { Chip } from '@/components/ui/Chip';
import { ListStatus } from '@/components/ui/ListStatus';
import { SearchBar } from '@/components/ui/SearchBar';
import { WoodHeader } from '@/components/ui/WoodHeader';
import { WishlistCard } from '@/components/wishlist/WishlistCard';
import { COLORS } from '@/constants/theme';
import { STRINGS } from '@/constants/strings';
import { useWishlistList, type WishlistFilter } from './useWishlistList';

const TEXT = STRINGS.wishlistScreens;

const FILTERS: { value: WishlistFilter; label: string }[] = [
  { value: 'pending', label: TEXT.filterPending },
  { value: 'purchased', label: TEXT.filterPurchased },
  { value: 'all', label: TEXT.filterAll },
];

// Lista de deseos: encabezado de madera fijo y una FlatList de una columna.
// Arriba van los filtros, la búsqueda y "Agregar deseo". Solo dibuja: la lógica está en useWishlistList.
export default function WishlistScreen() {
  const list = useWishlistList();
  const hasNoItems = list.items.length === 0;

  return (
    <View className="flex-1 bg-linen">
      <WoodHeader title={STRINGS.titles.wishlist} subtitle={`${list.pendingCount} ${list.pendingCount === 1 ? TEXT.pendingOne : TEXT.pendingMany}`} />

      <FlatList
        data={list.filteredItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, paddingBottom: 32, flexGrow: 1 }}
        ItemSeparatorComponent={() => <View className="h-3" />}
        renderItem={({ item }) => <WishlistCard item={item} onPress={() => list.openWish(item)} />}
        ListHeaderComponent={
          <View className="gap-3 mb-6">
            <View className="flex-row gap-2">
              {FILTERS.map((option) => (
                <Chip
                  key={option.value}
                  label={option.label}
                  selected={list.filter === option.value}
                  onPress={() => list.setFilter(option.value)}
                />
              ))}
            </View>
            <SearchBar value={list.search} onChangeText={list.setSearch} placeholder={TEXT.search} />
            <AddButton label={STRINGS.actions.addWish} onPress={list.openNewWish} />
            {!!list.error && !hasNoItems && (
              <Text className="font-body text-sm text-danger bg-danger-soft border border-danger-border rounded-2xl p-3 text-center">
                {list.error}
              </Text>
            )}
          </View>
        }
        ListEmptyComponent={
          <ListStatus
            isLoading={list.isLoading}
            error={list.error}
            isEmpty
            emptyTitle={hasNoItems ? TEXT.emptyTitle : TEXT.noMatchTitle}
            emptyDescription={hasNoItems ? TEXT.emptyDescription : TEXT.noMatchDescription}
          />
        }
        refreshControl={
          <RefreshControl refreshing={list.isRefreshing} onRefresh={list.onRefresh} tintColor={COLORS.walnut} />
        }
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      />
    </View>
  );
}
