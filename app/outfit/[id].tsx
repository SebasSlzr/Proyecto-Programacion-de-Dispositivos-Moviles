import { useEffect, useState } from 'react';
import { View, Pressable, Text, Alert, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ScreenHeader } from '../../src/components/ui/ScreenHeader';
import { OutfitForm } from '../../src/components/ui/OutfitForm';
import { updateOutfit, deleteOutfit, type OutfitInput } from '../../src/api/outfits';
import { listGarments } from '../../src/api/garments';
import { COLORS } from '../../src/constants/theme';
import type { Garment } from '../../src/types';

export default function EditOutfitScreen() {
  const params = useLocalSearchParams<{ id: string; name: string; head: string; legs: string; feet: string; torso: string }>();
  const [wardrobe, setWardrobe] = useState<Garment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    listGarments().then((data) => setWardrobe(data.garments)).finally(() => setIsLoading(false));
  }, []);

  const initialValues: OutfitInput = {
    name: params.name,
    head: params.head || null,
    legs: params.legs || null,
    feet: params.feet || null,
    torso: params.torso ? JSON.parse(params.torso) : [],
  };

  const confirmDelete = () => {
    Alert.alert('Eliminar outfit', 'Esta acción no se puede deshacer.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          await deleteOutfit(params.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-linen px-6" style={{ paddingTop: 60 }}>
      <View className="flex-row justify-between mb-2">
        <Pressable onPress={confirmDelete}>
          <Text className="font-body-medium text-red-500">Eliminar</Text>
        </Pressable>
        <Pressable onPress={() => router.back()}>
          <Text className="font-body-medium text-plum">Cerrar</Text>
        </Pressable>
      </View>

      <ScreenHeader title="Editar outfit" subtitle="Ajusta las prendas de este look" />

      <View className="mt-6 flex-1">
        {isLoading ? (
          <ActivityIndicator color={COLORS.plum} style={{ marginTop: 40 }} />
        ) : (
          <OutfitForm
            wardrobe={wardrobe}
            initialValues={initialValues}
            submitLabel="Guardar cambios"
            onSubmit={async (values) => {
              await updateOutfit(params.id, values);
              router.back();
            }}
          />
        )}
      </View>
    </View>
  );
}