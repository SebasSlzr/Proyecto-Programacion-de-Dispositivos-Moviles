import { View } from 'react-native';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ModalHeader } from '@/components/ui/ModalHeader';
import { GarmentForm } from '@/components/garments/GarmentForm';
import { useNewGarment } from './useNewGarment';

export default function NewGarmentScreen() {
  const { saveGarment } = useNewGarment();

  return (
    <View className="flex-1 bg-linen px-6" style={{ paddingTop: 60 }}>
      <ModalHeader />

      <ScreenHeader title="Nueva prenda" subtitle="Agrégala a tu armario" />

      <View className="mt-6 flex-1">
        <GarmentForm submitLabel="Guardar prenda" onSubmit={saveGarment} />
      </View>
    </View>
  );
}
