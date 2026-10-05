import { View } from 'react-native';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ModalHeader } from '@/components/ui/ModalHeader';
import { GarmentForm } from '@/components/garments/GarmentForm';
import { useEditGarment } from './useEditGarment';

export default function EditGarmentScreen() {
  const { initialValues, saveGarment, confirmDelete } = useEditGarment();

  return (
    <View className="flex-1 bg-linen px-6" style={{ paddingTop: 60 }}>
      <ModalHeader onDelete={confirmDelete} />

      <ScreenHeader title="Editar prenda" subtitle="Actualiza los datos de tu prenda" />

      <View className="mt-6 flex-1">
        <GarmentForm submitLabel="Guardar cambios" initialValues={initialValues} onSubmit={saveGarment} />
      </View>
    </View>
  );
}
