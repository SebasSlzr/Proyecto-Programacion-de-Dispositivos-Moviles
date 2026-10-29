import { View } from 'react-native';
import { COLORS } from '@/constants/theme';

type MetalRailProps = {
  className?: string;
};

// Riel metálico de 10 px: tres franjas (brillo, cuerpo, sombra) simulan el cilindro.
export function MetalRail({ className = '' }: MetalRailProps) {
  return (
    <View
      className={className}
      style={{
        borderRadius: 5,
        backgroundColor: COLORS.metal,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
      }}
    >
      <View className="h-2.5 rounded-full overflow-hidden">
        <View style={{ height: 3, backgroundColor: COLORS.metalLight }} />
        <View style={{ height: 4, backgroundColor: COLORS.metal }} />
        <View style={{ height: 3, backgroundColor: COLORS.metalDark }} />
      </View>
    </View>
  );
}