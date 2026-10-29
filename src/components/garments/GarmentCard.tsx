import { Pressable, Text, View } from 'react-native';
import { Badge } from '@/components/ui/Badge';
import { GarmentImage } from '@/components/ui/GarmentImage';
import { Hanger } from '@/components/ui/Hanger';
import { MetalRail } from '@/components/ui/MetalRail';
import type { Garment } from '@/types';

type GarmentCardProps = {
  garment: Garment;
  onPress: () => void; // qué hacer al tocar la tarjeta (la pantalla decide: abrir el detalle)
};

// Sombra suave en reposo y casi nula al presionar: la tarjeta "se acerca" al fondo.
// Va en un contenedor sin overflow: 'hidden', porque en iOS ese estilo recorta la sombra.
const RESTING_SHADOW = {
  shadowColor: '#1E120A',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.18,
  shadowRadius: 6,
  elevation: 3,
};

const PRESSED_SHADOW = {
  shadowColor: '#1E120A',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.08,
  shadowRadius: 2,
  elevation: 1,
};

// Prenda colgada en el clóset: riel metálico, percha y la foto como protagonista.
// - El riel se sale 8 px a cada lado (-mx-2) para que, en la cuadrícula de dos
//   columnas, los rieles de dos tarjetas vecinas se vean como una sola barra.
// - La percha sube 10 px (marginTop: -10) para que el gancho quede sobre el riel.
// - Al presionar, la percha y la tarjeta bajan 2 px y pierden sombra; el riel no se mueve.
export function GarmentCard({ garment, onPress }: GarmentCardProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${garment.name}, ${garment.category}, color ${garment.color}`}
      accessibilityHint="Abre la prenda para verla o editarla"
      className="mb-5"
    >
      {({ pressed }) => (
        <>
          <MetalRail className="-mx-2" />

          <View style={{ transform: [{ translateY: pressed ? 2 : 0 }] }}>
            <View className="items-center" style={{ marginTop: -10 }}>
              <Hanger size={56} />
            </View>

            <View className="bg-ivory rounded-2xl" style={pressed ? PRESSED_SHADOW : RESTING_SHADOW}>
              <View className="bg-ivory rounded-2xl border border-taupe p-2 overflow-hidden">
                <GarmentImage
                  imageUrl={garment.imageUrl}
                  swatchColor={garment.swatchColor}
                  className="h-40 rounded-xl"
                  width={480}
                />

                <View className="px-1 pt-2.5 pb-1">
                  <Text className="font-body-bold text-ink text-sm" numberOfLines={1}>
                    {garment.name}
                  </Text>
                  <View className="flex-row items-center justify-between mt-1.5 gap-2">
                    <Text className="font-body text-ink/70 text-xs flex-shrink" numberOfLines={1}>
                      {garment.category}
                    </Text>
                    <Badge label={garment.color} />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </>
      )}
    </Pressable>
  );
}