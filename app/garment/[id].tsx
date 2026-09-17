import { View, Pressable, Text, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ScreenHeader } from '../../src/components/ui/ScreenHeader';
import { GarmentForm } from '../../src/components/ui/GarmentForm';
import { updateGarment, deleteGarment } from '../../src/api/garments';

export default function EditGarmentScreen() {
  const params = useLocalSearchParams<{
    id: string;
    name: string;
    category: string;
    color: string;
    swatchColor: string;
  }>();

  const confirmDelete = () => {
    Alert.alert('Eliminar prenda', 'Esta acción no se puede deshacer.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          await deleteGarment(params.id);
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

      <ScreenHeader title="Editar prenda" subtitle="Actualiza los datos de tu prenda" />

      <View className="mt-6 flex-1">
        <GarmentForm
          submitLabel="Guardar cambios"
          initialValues={{
            name: params.name,
            category: params.category,
            color: params.color,
            swatchColor: params.swatchColor,
          }}
          onSubmit={async (values) => {
            await updateGarment(params.id, values);
            router.back();
          }}
        />
      </View>
    </View>
  );
}