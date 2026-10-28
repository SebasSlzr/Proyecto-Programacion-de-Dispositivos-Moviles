import { Button } from '@/components/ui/Button';
import { GarmentImage } from '@/components/ui/GarmentImage';
import { Text, View } from 'react-native';
import { useImagePicking } from './useImagePicking';

type PhotoPickerProps = {
  uri: string | null;                      // foto actual: URI local o URL de Cloudinary
  swatchColor: string;                     // color de respaldo cuando no hay foto
  onChange: (uri: string | null) => void;  // avisa la foto nueva, o null si se quitó
  disabled?: boolean;                      // por ejemplo mientras se guarda el formulario
};

// Muestra la foto de la prenda (protagonista, sobre ivory con marco de roble)
// y las acciones para tomarla, elegirla o quitarla. No conoce el formulario:
// solo recibe la foto actual y avisa los cambios por onChange.
export function PhotoPicker({ uri, swatchColor, onChange, disabled = false }: PhotoPickerProps) {
  const { takePhoto, pickFromGallery, isPicking, error } = useImagePicking();
  const isBusy = disabled || isPicking;

  // Si la persona canceló, el hook devuelve null y la foto actual se conserva.
  const handlePick = async (pick: () => Promise<string | null>) => {
    const newUri = await pick();
    if (newUri) onChange(newUri);
  };

  return (
    <View className="gap-3">
      <View className="bg-ivory border-2 border-oak rounded-2xl p-2">
        <GarmentImage imageUrl={uri} swatchColor={swatchColor} className="w-full aspect-square rounded-xl" />
      </View>

      <View className="flex-row gap-3">
        <View className="flex-1">
          <Button label="Tomar foto" variant="secondary" onPress={() => handlePick(takePhoto)} disabled={isBusy} />
        </View>
        <View className="flex-1">
          <Button label="Galería" variant="secondary" onPress={() => handlePick(pickFromGallery)} disabled={isBusy} />
        </View>
      </View>

      {!!uri && <Button label="Quitar foto" variant="secondary" onPress={() => onChange(null)} disabled={isBusy} />}

      {!!error && (
        <Text className="font-body text-sm text-red-500 bg-red-50 rounded-2xl p-3 text-center">{error}</Text>
      )}
    </View>
  );
}
