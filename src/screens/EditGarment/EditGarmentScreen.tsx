import { View } from 'react-native';
import { ModalHeader } from '@/components/ui/ModalHeader';
import { GarmentForm } from '@/components/garments/GarmentForm';
import { useEditGarment } from './useEditGarment';

export default function EditGarmentScreen() {
  const { initialValues, saveGarment, confirmDelete } = useEditGarment();

  return (
    <View className="flex-1 bg-linen">
      <ModalHeader title="Editar prenda" subtitle="Actualiza los datos de tu prenda" onDelete={confirmDelete} />

      <View className="flex-1">
        <GarmentForm submitLabel="Guardar cambios" initialValues={initialValues} onSubmit={saveGarment} />
      </View>
    </View>
  );
}