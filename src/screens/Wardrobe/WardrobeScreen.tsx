import { View, ScrollView, RefreshControl, ActivityIndicator, Pressable, Text } from 'react-native';
import { router } from 'expo-router';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SearchBar } from '@/components/ui/SearchBar';
import { Chip } from '@/components/ui/Chip';
import { AddButton } from '@/components/ui/AddButton';
import { ProfileButton } from '@/components/ui/ProfileButton';
import { GarmentCard } from '@/components/garments/GarmentCard';
import { CATEGORIES } from '@/constants/garments';
import { COLORS } from '@/constants/theme';
import { useGarmentList } from './useGarmentList';

export default function WardrobeScreen() {
  const {
    garments,
    filteredGarments,
    isLoading,
    isRefreshing,
    error,
    search,
    setSearch,
    categoryFilter,
    toggleCategory,
    onRefresh,
  } = useGarmentList();

  return (
    <ScrollView
      className="flex-1 bg-linen"
      contentContainerStyle={{ padding: 20, paddingTop: 60, flexGrow: 1 }}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={COLORS.plum} />}
    >
      <View className="flex-row items-start justify-between">
        <ScreenHeader title="Tu armario" subtitle={`${garments.length} prendas guardadas`} />
        <ProfileButton />
      </View>

      <View className="mt-5 gap-3">
        <SearchBar value={search} onChangeText={setSearch} placeholder="Buscar prenda…" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          <Chip label="Todas" selected={categoryFilter === null} onPress={() => toggleCategory(null)} />
          {CATEGORIES.map((category) => (
            <Chip
              key={category}
              label={category}
              selected={categoryFilter === category}
              onPress={() => toggleCategory(category)}
            />
          ))}
        </ScrollView>
        <AddButton label="Agregar prenda" onPress={() => router.push('/garment/new')} />
      </View>

      {isLoading ? (
        <ActivityIndicator color={COLORS.plum} style={{ marginTop: 40 }} />
      ) : error ? (
        <Text className="font-body text-red-500 text-center mt-10">{error}</Text>
      ) : filteredGarments.length === 0 ? (
        <View className="items-center mt-16 px-8">
          <Text className="font-display text-xl text-ink text-center">
            {garments.length === 0 ? 'Tu armario está vacío' : 'Nada coincide con tu búsqueda'}
          </Text>
          <Text className="font-body text-ink/60 text-sm text-center mt-2">
            {garments.length === 0
              ? 'Toca "Agregar prenda" para empezar.'
              : 'Prueba con otro texto o quita el filtro de categoría.'}
          </Text>
        </View>
      ) : (
        <View className="flex-row flex-wrap justify-between mt-6">
          {filteredGarments.map((garment) => (
            <Pressable
              key={garment.id}
              style={{ width: '47%' }}
              onPress={() => router.push({ pathname: '/garment/[id]', params: { ...garment } })}
            >
              <GarmentCard garment={garment} />
            </Pressable>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
