import { RefreshControl, ScrollView, View } from 'react-native';
import { CategoryFilter } from '@/components/garments/CategoryFilter';
import { GarmentGrid } from '@/components/garments/GarmentGrid';
import { AddButton } from '@/components/ui/AddButton';
import { ListStatus } from '@/components/ui/ListStatus';
import { ProfileButton } from '@/components/ui/ProfileButton';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SearchBar } from '@/components/ui/SearchBar';
import { COLORS } from '@/constants/theme';
import { useGarmentList } from './useGarmentList';

export default function WardrobeScreen() {
  const list = useGarmentList();
  const isWardrobeEmpty = list.garments.length === 0;

  return (
    <ScrollView
      className="flex-1 bg-linen"
      contentContainerStyle={{ padding: 20, paddingTop: 60, flexGrow: 1 }}
      refreshControl={
        <RefreshControl refreshing={list.isRefreshing} onRefresh={list.onRefresh} tintColor={COLORS.plum} />
      }
    >
      <View className="flex-row items-start justify-between">
        <ScreenHeader title="Tu armario" subtitle={`${list.garments.length} prendas guardadas`} />
        <ProfileButton />
      </View>

      <View className="mt-5 gap-3">
        <SearchBar value={list.search} onChangeText={list.setSearch} placeholder="Buscar prenda…" />
        <CategoryFilter
          selected={list.categoryFilter}
          onSelect={list.toggleCategory}
          onClear={list.clearCategory}
        />
        <AddButton label="Agregar prenda" onPress={list.openNewGarment} />
      </View>

      <ListStatus
        isLoading={list.isLoading}
        error={list.error}
        isEmpty={list.filteredGarments.length === 0}
        emptyTitle={isWardrobeEmpty ? 'Tu armario está vacío' : 'Nada coincide con tu búsqueda'}
        emptyDescription={
          isWardrobeEmpty
            ? 'Toca "Agregar prenda" para empezar.'
            : 'Prueba con otro texto o quita el filtro de categoría.'
        }
      >
        <GarmentGrid garments={list.filteredGarments} onPressGarment={list.openGarment} />
      </ListStatus>
    </ScrollView>
  );
}