import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';

type StatTileProps = {
  label: string;                               // qué se cuenta ("Prendas")
  value: number;                               // el número
  icon: keyof typeof Ionicons.glyphMap;        // ícono que acompaña el número (no solo texto)
};

// Tarjeta pequeña de estadística: ícono en un círculo de roble, número grande en la
// letra de títulos y la etiqueta debajo. Se usa en el panel y en el detalle de un usuario.
// El ícono es decorativo (la etiqueta ya dice qué es), por eso se lee como un solo texto.
export function StatTile({ label, value, icon }: StatTileProps) {
  return (
    <View
      className="flex-1 bg-ivory rounded-2xl border border-taupe p-3 items-center shadow-sm"
      accessible
      accessibilityLabel={`${value} ${label}`}
    >
      <View className="w-9 h-9 rounded-full bg-oak-light items-center justify-center">
        <Ionicons name={icon} size={18} color={COLORS.walnutDark} />
      </View>
      <Text className="font-display text-2xl text-ink mt-1.5">{value}</Text>
      <Text className="font-body text-ink-muted text-xs mt-0.5">{label}</Text>
    </View>
  );
}
