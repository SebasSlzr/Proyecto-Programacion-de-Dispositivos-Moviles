import { View, Pressable, Text } from 'react-native';
import { router } from 'expo-router';
import { ScreenHeader } from '../../src/components/ui/ScreenHeader';
import { GarmentForm } from '../../src/components/ui/GarmentForm';
import { createGarment } from '../../src/api/garments';
import type { GarmentInput } from '../../src/api/garments';

export default function NewGarmentScreen() {
  return (
    <View className="flex-1 bg-linen px-6" style={{ paddingTop: 60 }}>
      <Pressable onPress={() => router.back()} className="self-end mb-2">
        <Text className="font-body-medium text-plum">Cerrar</Text>
      </Pressable>

      <ScreenHeader title="Nueva prenda" subtitle="Agrégala a tu armario" />

      <View className="mt-6 flex-1">
        <GarmentForm
          submitLabel="Guardar prenda"
          onSubmit={async (values) => {
          await createGarment(values as GarmentInput);
          router.back();
        }}
        />
      </View>
    </View>
  );
}
