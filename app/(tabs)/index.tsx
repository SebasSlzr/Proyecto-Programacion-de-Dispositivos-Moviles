import { useCallback, useMemo, useState } from 'react';
import { View, ScrollView, RefreshControl, ActivityIndicator, Pressable, Text } from 'react-native';
import { router } from 'expo-router';
import { useFocusEffect } from 'expo-router/react-navigation';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../../src/components/ui/ScreenHeader';
import { GarmentCard } from '../../src/components/ui/GarmentCard';
import { SearchBar } from '../../src/components/ui/SearchBar';
import { Chip } from '../../src/components/ui/Chip';
import { listGarments } from '../../src/api/garments';
import { CATEGORIES } from '../../src/constants/garments';
import { COLORS } from '../../src/constants/theme';
import type { Garment } from '../../src/types';

export default function ArmarioScreen() {
  const [garments, setGarments] = useState<Garment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const loadGarments = useCallback(async () => {
    try {
      const data = await listGarments();
      setGarments(data.garments);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      loadGarments().finally(() => setIsLoading(false));
    }, [loadGarments])
  );

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadGarments();
    setIsRefreshing(false);
  };

  // Búsqueda y filtro son locales: la lista ya se trajo completa, no hace
  // falta pedirle al servidor cada vez que la persona escribe una letra.
  const filteredGarments = useMemo(() => {
    return garments.filter((garment) => {
      const matchesSearch = garment.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !categoryFilter || garment.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [garments, search, categoryFilter]);

  return (
    <ScrollView
      className="flex-1 bg-linen"
      contentContainerStyle={{ padding: 20, paddingTop: 60, flexGrow: 1 }}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={COLORS.plum} />}
    >
      <View className="flex-row items-start justify-between">
        <ScreenHeader title="Tu armario" subtitle={`${garments.length} prendas guardadas`} />
        <Pressable
          onPress={() => router.push('/garment/new')}
          className="bg-plum rounded-full w-11 h-11 items-center justify-center"
        >
          <Ionicons name="add" size={24} color={COLORS.ivory} />
        </Pressable>
      </View>

      <View className="mt-5 gap-3">
        <SearchBar value={search} onChangeText={setSearch} placeholder="Buscar prenda…" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          <Chip label="Todas" selected={categoryFilter === null} onPress={() => setCategoryFilter(null)} />
          {CATEGORIES.map((category) => (
            <Chip
              key={category}
              label={category}
              selected={categoryFilter === category}
              onPress={() => setCategoryFilter(categoryFilter === category ? null : category)}
            />
          ))}
        </ScrollView>
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
              ? 'Toca el botón + para agregar tu primera prenda.'
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