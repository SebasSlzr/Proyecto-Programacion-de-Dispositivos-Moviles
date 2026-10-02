import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';

type ModalHeaderProps = { onDelete?: () => void };

// Barra superior de los modales: "Cerrar" y, si se pasa onDelete, "Eliminar".
export function ModalHeader({ onDelete }: ModalHeaderProps) {
  return (
    <View className={`flex-row mb-2 ${onDelete ? 'justify-between' : 'justify-end'}`}>
      {onDelete && (
        <Pressable onPress={onDelete}>
          <Text className="font-body-medium text-red-500">Eliminar</Text>
        </Pressable>
      )}
      <Pressable onPress={() => router.back()}>
        <Text className="font-body-medium text-plum">Cerrar</Text>
      </Pressable>
    </View>
  );
}
