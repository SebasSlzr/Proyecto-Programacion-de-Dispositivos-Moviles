import { FlatList, RefreshControl, Text, View } from 'react-native';
import { CategoryFilter } from '@/components/garments/CategoryFilter';
import { ColorFilter } from '@/components/garments/ColorFilter';
import { GarmentCard } from '@/components/garments/GarmentCard';
import { AddButton } from '@/components/ui/AddButton';
import { ListStatus } from '@/components/ui/ListStatus';
import { SearchBar } from '@/components/ui/SearchBar';
import { WoodHeader } from '@/components/ui/WoodHeader';
import { COLORS } from '@/constants/theme';
import { useGarmentList } from './useGarmentList';
import { STRINGS } from '@/constants/strings';

// Armario: encabezado de madera fijo y debajo una sola FlatList de dos columnas.
// - FlatList solo dibuja las tarjetas visibles (ScrollView + map las dibujaba todas).
// - Búsqueda, filtros y "Agregar prenda" van en ListHeaderComponent para que se
//   desplacen con la lista sin anidar listas. Se pasa como elemento JSX (no como
//   función creada aquí) para que el buscador no pierda el foco en cada letra.
// - ListEmptyComponent muestra carga, error o vacío cuando no hay prendas que dibujar.
export default function WardrobeScreen() {
  const list = useGarmentList();
  const total = list.garments.length;
  const isWardrobeEmpty = total === 0;
  // Si lo único activo es el filtro de color, el mensaje vacío habla del color.
  const isOnlyColorFiltered = !!list.colorFilter && !list.categoryFilter && !list.search;

  return (
    <View className="flex-1 bg-linen">
      <WoodHeader title="Tu armario" subtitle={`${total} ${total === 1 ? 'prenda guardada' : 'prendas guardadas'}`} />

      <FlatList
        data={list.filteredGarments}
        keyExtractor={(garment) => garment.id}
        numColumns={2}
        // Cada celda mide 48% y el espacio sobrante queda entre las dos columnas.
        // Con flex: 1, una prenda sola en la última fila se estiraría a todo el ancho.
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ padding: 20, paddingBottom: 32, flexGrow: 1 }}
        renderItem={({ item }) => (
          <View style={{ width: '48%' }}>
            <GarmentCard garment={item} onPress={() => list.openGarment(item)} />
          </View>
        )}
        ListHeaderComponent={
          <View className="gap-3 mb-6">
            <SearchBar value={list.search} onChangeText={list.setSearch} placeholder="Buscar prenda…" />
            <CategoryFilter
              selected={list.categoryFilter}
              onSelect={list.toggleCategory}
              onClear={list.clearCategory}
            />
            {/* Solo aparece si hay prendas: muestra las familias de color presentes. */}
            {list.availableColors.length > 0 && (
              <ColorFilter
                available={list.availableColors}
                selected={list.colorFilter}
                onSelect={list.toggleColor}
                onClear={list.clearColor}
              />
            )}
            <AddButton label={STRINGS.actions.addGarment} onPress={list.openNewGarment} />
            {/* Si falla una recarga pero ya hay prendas, se avisa sin esconder la lista. */}
            {!!list.error && !isWardrobeEmpty && (
              <Text className="font-body text-sm text-danger bg-danger-soft rounded-2xl p-3 text-center">
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
            emptyTitle={
              isWardrobeEmpty
                ? 'Tu armario está vacío'
                : isOnlyColorFiltered
                  ? STRINGS.wardrobe.emptyColor
                  : 'Nada coincide con tu búsqueda'
            }
            emptyDescription={
              isWardrobeEmpty
                ? 'Toca "Agregar prenda" para empezar.'
                : isOnlyColorFiltered
                  ? STRINGS.wardrobe.emptyColorDescription
                  : 'Prueba con otro texto o quita los filtros de categoría y color.'
            }
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