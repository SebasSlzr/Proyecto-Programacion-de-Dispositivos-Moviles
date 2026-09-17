import { useEffect, useState } from 'react';
import { View, Pressable, Text, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { ScreenHeader } from '../../src/components/ui/ScreenHeader';
import { OutfitForm } from '../../src/components/ui/OutfitForm';
import { createOutfit, type OutfitInput } from '../../src/api/outfits';
import { listGarments } from '../../src/api/garments';
import { COLORS } from '../../src/constants/theme';
import type { Garment } from '../../src/types';

export default function NewOutfitScreen() {
  const [wardrobe, setWardrobe] = useState<Garment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    listGarments().then((data) => setWardrobe(data.garments)).finally(() => setIsLoading(false));
  }, []);

  return (
    <View className="flex-1 bg-linen px-6" style={{ paddingTop: 60 }}>
      <Pressable onPress={() => router.back()} className="self-end mb-2">
        <Text className="font-body-medium text-plum">Cerrar</Text>
      </Pressable>

      <ScreenHeader title="Nuevo outfit" subtitle="Combina prendas de tu armario" />

      <View className="mt-6 flex-1">
        {isLoading ? (
          <ActivityIndicator color={COLORS.plum} style={{ marginTop: 40 }} />
        ) : (
          <OutfitForm
            wardrobe={wardrobe}
            submitLabel="Guardar outfit"
            onSubmit={async (values) => {
              await createOutfit(values as OutfitInput);
              router.back();
            }}
          />
        )}
      </View>
    </View>
  );
}