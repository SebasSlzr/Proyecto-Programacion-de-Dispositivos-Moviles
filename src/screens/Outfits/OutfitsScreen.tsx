import { View, ScrollView, RefreshControl, ActivityIndicator, Text } from 'react-native';
import { router } from 'expo-router';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SearchBar } from '@/components/ui/SearchBar';
import { AddButton } from '@/components/ui/AddButton';
import { ProfileButton } from '@/components/ui/ProfileButton';
import { OutfitGrid } from '@/components/outfits/OutfitGrid';
import { COLORS } from '@/constants/theme';
import { useOutfitList } from './useOutfitList';

export default function OutfitsScreen() {
  const { outfits, filteredOutfits, isLoading, isRefreshing, error, search, setSearch, onRefresh, openOutfit } =
    useOutfitList();

  return (
    <ScrollView
      className="flex-1 bg-linen"
      contentContainerStyle={{ padding: 20, paddingTop: 60, flexGrow: 1 }}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={COLORS.plum} />}
    >
      <View className="flex-row items-start justify-between">
        <ScreenHeader title="Outfits" subtitle={`${outfits.length} outfits guardados`} />
        <ProfileButton />
      </View>

      <View className="mt-5 gap-3">
        <SearchBar value={search} onChangeText={setSearch} placeholder="Buscar outfit…" />
        <AddButton label="Agregar outfit" onPress={() => router.push('/outfit/new')} />
      </View>

      {isLoading ? (
        <ActivityIndicator color={COLORS.plum} style={{ marginTop: 40 }} />
      ) : error ? (
        <Text className="font-body text-red-500 text-center mt-10">{error}</Text>
      ) : filteredOutfits.length === 0 ? (
        <View className="items-center mt-16 px-8">
          <Text className="font-display text-xl text-ink text-center">
            {outfits.length === 0 ? 'Aún no has armado ningún outfit' : 'Nada coincide con tu búsqueda'}
          </Text>
          <Text className="font-body text-ink/60 text-sm text-center mt-2">
            {outfits.length === 0 ? 'Toca "Agregar outfit" y combina prendas de tu armario.' : 'Prueba con otro nombre.'}
          </Text>
        </View>
      ) : (
        <OutfitGrid outfits={filteredOutfits} onPressOutfit={openOutfit} />
      )}
    </ScrollView>
  );
}