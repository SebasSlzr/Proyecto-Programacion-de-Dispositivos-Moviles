import { Image } from 'expo-image';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS } from '@/constants/theme';

const TEXTURES = {
  walnut: require('../../../assets/images/wood/walnut.jpg'),
  oak: require('../../../assets/images/wood/oak.jpg'),
};

type WoodSurfaceProps = {
  variant?: 'walnut' | 'oak';
  bevel?: 'top' | 'bottom' | 'both' | 'none';
  radius?: number;      // esquinas redondeadas (px); recorta la textura y la sombra
  shadow?: boolean;
  className?: string;   // padding, alto, alineación del contenido
  children?: ReactNode;
};

// Contenedor con textura de madera y bisel. Son dos capas porque en iOS un View
// con overflow: 'hidden' recorta su propia sombra: la externa lleva la sombra
// y la interna recorta la textura.
export function WoodSurface({
  variant = 'walnut',
  bevel = 'both',
  radius = 0,
  shadow = true,
  className = '',
  children,
}: WoodSurfaceProps) {
  const showTop = bevel === 'top' || bevel === 'both';
  const showBottom = bevel === 'bottom' || bevel === 'both';

  return (
    <View
      style={[
        { borderRadius: radius, backgroundColor: variant === 'walnut' ? COLORS.walnut : COLORS.oak },
        shadow && {
          shadowColor: '#1E120A',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.35,
          shadowRadius: 4,
          elevation: 4,
        },
      ]}
    >
      <View className={`overflow-hidden ${className}`} style={{ borderRadius: radius }}>
        <Image source={TEXTURES[variant]} style={StyleSheet.absoluteFill} contentFit="cover" />
        {showTop && (
          <View
            pointerEvents="none"
            style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, backgroundColor: 'rgba(255,255,255,0.18)' }}
          />
        )}
        {showBottom && (
          <View
            pointerEvents="none"
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, backgroundColor: 'rgba(0,0,0,0.35)' }}
          />
        )}
        {children}
      </View>
    </View>
  );
}