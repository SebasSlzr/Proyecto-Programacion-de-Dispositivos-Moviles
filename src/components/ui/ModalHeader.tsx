import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WoodSurface } from '@/components/ui/WoodSurface';

type ModalHeaderProps = {
  onDelete?: () => void;  // si se pasa, aparece "Eliminar"
  title?: string;         // si se pasa, el encabezado es una barra de madera con el título
  subtitle?: string;
  onClose?: () => void;   // por defecto cierra el modal (router.back)
};

// Barra superior de los modales: "Cerrar" y, si se pasa onDelete, "Eliminar".
// Con `title` se dibuja como encabezado de madera (walnut) con textos en ivory.
// Sin `title` se ve como antes, para no cambiar las pantallas que aún no lo usan.
export function ModalHeader({ onDelete, title, subtitle, onClose = () => router.back() }: ModalHeaderProps) {
  const insets = useSafeAreaInsets();

  if (!title) {
    return (
      <View className={`flex-row mb-2 ${onDelete ? 'justify-between' : 'justify-end'}`}>
        {onDelete && (
          <Pressable onPress={onDelete}>
            <Text className="font-body-medium text-red-500">Eliminar</Text>
          </Pressable>
        )}
        <Pressable onPress={onClose}>
          <Text className="font-body-medium text-plum">Cerrar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <WoodSurface variant="walnut" bevel="bottom">
      <View className="px-6 pb-5 gap-3" style={{ paddingTop: Math.max(insets.top, 20) + 12 }}>
        <View className={`flex-row ${onDelete ? 'justify-between' : 'justify-end'}`}>
          {onDelete && (
            <Pressable onPress={onDelete} hitSlop={12} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
              <Text className="font-body-medium text-red-300">Eliminar</Text>
            </Pressable>
          )}
          <Pressable onPress={onClose} hitSlop={12} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
            <Text className="font-body-medium text-ivory">Cerrar</Text>
          </Pressable>
        </View>

        <View>
          <Text className="font-display text-3xl text-ivory">{title}</Text>
          {!!subtitle && <Text className="font-body text-sm text-ivory/80 mt-1">{subtitle}</Text>}
        </View>
      </View>
    </WoodSurface>
  );
}