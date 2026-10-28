import { View } from 'react-native';
import { ModalHeader } from '@/components/ui/ModalHeader';
import { GarmentForm } from '@/components/garments/GarmentForm';
import { useNewGarment } from './useNewGarment';

export default function NewGarmentScreen() {
  const { saveGarment } = useNewGarment();

  return (
    <View className="flex-1 bg-linen">
      <ModalHeader title="Nueva prenda" subtitle="Agrégala a tu armario" />

      <View className="flex-1">
        <GarmentForm submitLabel="Guardar prenda" onSubmit={saveGarment} />
      </View>
    </View>
  );
}
