import { Pressable, RefreshControl, ScrollView, View } from 'react-native';
import { OutfitCard } from '@/components/outfits/OutfitCard';
import { AddButton } from '@/components/ui/AddButton';
import { ListStatus } from '@/components/ui/ListStatus';
import { ProfileButton } from '@/components/ui/ProfileButton';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SearchBar } from '@/components/ui/SearchBar';
import { COLORS } from '@/constants/theme';
import { useOutfitList } from './useOutfitList';

export default function OutfitsScreen() {
  const list = useOutfitList();
  const hasNoOutfits = list.outfits.length === 0;

  return (
    <ScrollView
      className="flex-1 bg-linen"
      contentContainerStyle={{ padding: 20, paddingTop: 60, flexGrow: 1 }}
      refreshControl={
        <RefreshControl refreshing={list.isRefreshing} onRefresh={list.onRefresh} tintColor={COLORS.plum} />
      }
    >
      <View className="flex-row items-start justify-between">
        <ScreenHeader title="Outfits" subtitle={`${list.outfits.length} outfits guardados`} />
        <ProfileButton />
      </View>

      <View className="mt-5 gap-3">
        <SearchBar value={list.search} onChangeText={list.setSearch} placeholder="Buscar outfit…" />
        <AddButton label="Agregar outfit" onPress={list.openNewOutfit} />
      </View>

      <ListStatus
        isLoading={list.isLoading}
        error={list.error}
        isEmpty={list.filteredOutfits.length === 0}
        emptyTitle={hasNoOutfits ? 'Aún no has armado ningún outfit' : 'Nada coincide con tu búsqueda'}
        emptyDescription={
          hasNoOutfits ? 'Toca "Agregar outfit" y combina prendas de tu armario.' : 'Prueba con otro nombre.'
        }
      >
        {/* Cuando el Integrante 3 una su OutfitGrid, esta grilla se cambia por ese componente. */}
        <View className="flex-row flex-wrap justify-between mt-6">
          {list.filteredOutfits.map((outfit) => (
            <Pressable key={outfit.id} style={{ width: '47%' }} onPress={() => list.openOutfit(outfit)}>
              <OutfitCard outfit={outfit} />
            </Pressable>
          ))}
        </View>
      </ListStatus>
    </ScrollView>
  );
}