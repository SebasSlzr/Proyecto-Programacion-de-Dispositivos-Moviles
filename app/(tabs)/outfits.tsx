import { useCallback, useMemo, useState } from 'react';
import { View, ScrollView, RefreshControl, ActivityIndicator, Pressable, Text } from 'react-native';
import { router } from 'expo-router';
import { useFocusEffect } from 'expo-router/react-navigation';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../../src/components/ui/ScreenHeader';
import { OutfitCard } from '../../src/components/ui/OutfitCard';
import { SearchBar } from '../../src/components/ui/SearchBar';
import { listOutfits } from '../../src/api/outfits';
import { COLORS } from '../../src/constants/theme';
import type { Outfit } from '../../src/types';

export default function OutfitsScreen() {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const loadOutfits = useCallback(async () => {
    try {
      const data = await listOutfits();
      setOutfits(data.outfits);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      loadOutfits().finally(() => setIsLoading(false));
    }, [loadOutfits])
  );

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadOutfits();
    setIsRefreshing(false);
  };

  const filteredOutfits = useMemo(
    () => outfits.filter((outfit) => outfit.name.toLowerCase().includes(search.toLowerCase())),
    [outfits, search]
  );

  return (
    <ScrollView
      className="flex-1 bg-linen"
      contentContainerStyle={{ padding: 20, paddingTop: 60, flexGrow: 1 }}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={COLORS.plum} />}
    >
      <View className="flex-row items-start justify-between">
        <ScreenHeader title="Outfits" subtitle={`${outfits.length} outfits guardados`} />
        <Pressable
          onPress={() => router.push('/outfit/new')}
          className="bg-plum rounded-full w-11 h-11 items-center justify-center"
        >
          <Ionicons name="add" size={24} color={COLORS.ivory} />
        </Pressable>
      </View>

      <View className="mt-5">
        <SearchBar value={search} onChangeText={setSearch} placeholder="Buscar outfit…" />
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
            {outfits.length === 0 ? 'Toca el botón + y combina prendas de tu armario.' : 'Prueba con otro nombre.'}
          </Text>
        </View>
      ) : (
        <View className="flex-row flex-wrap justify-between mt-6">
          {filteredOutfits.map((outfit) => (
            <Pressable
              key={outfit.id}
              style={{ width: '47%' }}
              onPress={() =>
                router.push({
                  pathname: '/outfit/[id]',
                  params: {
                    id: outfit.id,
                    name: outfit.name,
                    head: outfit.head?.id ?? '',
                    legs: outfit.legs?.id ?? '',
                    feet: outfit.feet?.id ?? '',
                    torso: JSON.stringify(outfit.torso.map((g) => g.id)),
                  },
                })
              }
            >
              <OutfitCard outfit={outfit} />
            </Pressable>
          ))}
        </View>
      )}
    </ScrollView>
  );
}