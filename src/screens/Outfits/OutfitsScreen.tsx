import { FlatList, RefreshControl, Text, View } from 'react-native';
import { OutfitCard } from '@/components/outfits/OutfitCard';
import { AddButton } from '@/components/ui/AddButton';
import { Button } from '@/components/ui/Button';
import { STRINGS } from '@/constants/strings';
import { ListStatus } from '@/components/ui/ListStatus';
import { SearchBar } from '@/components/ui/SearchBar';
import { WoodHeader } from '@/components/ui/WoodHeader';
import { COLORS } from '@/constants/theme';
import { useOutfitList } from './useOutfitList';

// Lista de outfits con la misma estructura que el armario: encabezado de madera
// fijo y una sola FlatList de dos columnas con búsqueda y "Agregar outfit" arriba.
export default function OutfitsScreen() {
  const list = useOutfitList();
  const total = list.outfits.length;
  const hasNoOutfits = total === 0;

  return (
    <View className="flex-1 bg-linen">
      <WoodHeader title="Outfits" subtitle={`${total} ${total === 1 ? 'outfit guardado' : 'outfits guardados'}`} />

      <FlatList
        data={list.filteredOutfits}
        keyExtractor={(outfit) => outfit.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ padding: 20, paddingBottom: 32, flexGrow: 1 }}
        renderItem={({ item }) => (
          <View style={{ width: '48%' }}>
            <OutfitCard outfit={item} onPress={() => list.openOutfit(item)} />
          </View>
        )}
        ListHeaderComponent={
          <View className="gap-3 mb-6">
            <SearchBar value={list.search} onChangeText={list.setSearch} placeholder="Buscar outfit…" />
            {/* Dos acciones: armar uno a mano (primaria, madera) o pedir una sugerencia
                por armonía de color (secundaria, borde de nogal). */}
            <AddButton label={STRINGS.actions.addOutfit} onPress={list.openNewOutfit} />
            <Button label={STRINGS.actions.suggestOutfit} variant="secondary" onPress={list.openSuggestedOutfit} />
            {!!list.error && !hasNoOutfits && (
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
            emptyTitle={hasNoOutfits ? 'Aún no has armado ningún outfit' : 'Nada coincide con tu búsqueda'}
            emptyDescription={
              hasNoOutfits ? 'Toca "Agregar outfit" y combina prendas de tu armario.' : 'Prueba con otro nombre.'
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