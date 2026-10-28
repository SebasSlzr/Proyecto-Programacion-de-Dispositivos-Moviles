import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

// Opciones comunes para cámara y galería: solo fotos, recorte cuadrado
// (todas las prendas se ven uniformes en el armario) y calidad 0.7 para que
// la subida a Cloudinary sea liviana. En iOS el recorte siempre es cuadrado;
// `aspect` solo lo usa Android.
const PICKER_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ['images'],
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.7,
};

// Encapsula la cámara y la galería. Devuelve el URI local de la foto elegida,
// o null si la persona canceló o algo falló (en ese caso deja el mensaje en `error`).
// No sabe nada del formulario: solo entrega URIs.
export function useImagePicking() {
  const [isPicking, setIsPicking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lógica compartida por las dos acciones: marca el estado de carga,
  // abre el selector y traduce el resultado a "URI o null".
  const pick = async (launch: () => Promise<ImagePicker.ImagePickerResult>) => {
    setIsPicking(true);
    setError(null);
    try {
      const result = await launch();
      if (result.canceled) return null;
      return result.assets[0]?.uri ?? null;
    } catch {
      setError('No se pudo abrir la cámara o la galería. Intenta de nuevo.');
      return null;
    } finally {
      setIsPicking(false);
    }
  };

  const takePhoto = async () => {
    // La cámara sí necesita permiso explícito. Si ya se negó antes, el sistema
    // no vuelve a preguntar: hay que activarlo desde los ajustes del celular.
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      setError(
        permission.canAskAgain
          ? 'Necesitamos permiso para usar la cámara.'
          : 'El permiso de cámara está desactivado. Actívalo desde los ajustes del celular para tomar fotos.'
      );
      return null;
    }
    return pick(() => ImagePicker.launchCameraAsync(PICKER_OPTIONS));
  };

  // La galería del sistema no necesita permiso en las versiones actuales
  // de iOS y Android: el selector solo entrega la foto que la persona elige.
  const pickFromGallery = () => pick(() => ImagePicker.launchImageLibraryAsync(PICKER_OPTIONS));

  return { takePhoto, pickFromGallery, isPicking, error };
}