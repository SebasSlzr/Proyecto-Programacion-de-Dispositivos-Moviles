import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProfileButton } from './ProfileButton';
import { WoodSurface } from './WoodSurface';

type WoodHeaderProps = {
  title: string;
  subtitle?: string;
};

// Encabezado fijo de las pestañas: una barra de nogal (la parte de arriba del
// clóset) con el título, un subtítulo opcional y el botón del perfil.
// - El texto va en ivory: sobre madera oscura nunca se usa ink (contraste 4.5:1).
// - Respeta el área segura de arriba (notch o barra de estado) con los insets.
// - Solo lleva bisel abajo, el borde que proyecta sombra sobre el fondo linen.
export function WoodHeader({ title, subtitle }: WoodHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <WoodSurface variant="walnut" bevel="bottom">
      <View className="flex-row items-center justify-between gap-3 px-5 pb-4" style={{ paddingTop: insets.top + 12 }}>
        <View className="flex-1">
          <Text className="font-display text-3xl text-ivory" numberOfLines={1}>
            {title}
          </Text>
          {!!subtitle && <Text className="font-body text-sm text-ivory/80 mt-0.5">{subtitle}</Text>}
        </View>
        <ProfileButton />
      </View>
    </WoodSurface>
  );
}