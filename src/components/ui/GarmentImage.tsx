import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS } from '@/constants/theme';

type GarmentImageProps = {
  imageUrl: string | null;   // URL de Cloudinary, URI local, o null
  swatchColor: string;       // color de respaldo cuando no hay foto
  className?: string;        // por ejemplo "h-40" o "w-16 h-16 rounded-2xl"
  width?: number;            // ancho aproximado para pedir la miniatura
  children?: ReactNode;      // se dibuja encima de la foto
};

// Pide a Cloudinary una versión liviana: formato y calidad automáticos y ancho acotado.
function optimize(url: string, width: number) {
  if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url;
  return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`);
}

export function GarmentImage({ imageUrl, swatchColor, className = '', width = 600, children }: GarmentImageProps) {
  return (
    <View
      className={`overflow-hidden items-center justify-center ${className}`}
      style={{ backgroundColor: swatchColor }}
    >
      {imageUrl ? (
        <Image
          source={{ uri: optimize(imageUrl, width) }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={150}
          cachePolicy="memory-disk"
        />
      ) : (
        <Ionicons name="shirt-outline" size={36} color={COLORS.ivory} />
      )}
      {children}
    </View>
  );
}