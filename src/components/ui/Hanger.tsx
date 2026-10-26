import Svg, { Path } from 'react-native-svg';
import { COLORS } from '@/constants/theme';

type HangerProps = {
  size?: number; // ancho en px
};

const HOOK = 'M32 15 V11.5 C32 8.5 36.5 8.5 36.5 5.5 C36.5 2.8 34 1.8 32 3';
const BODY = 'M32 15 L4.5 33 Q2.5 35 5 35 H59 Q61.5 35 59.5 33 Z';

// Percha de metal. Cada trazo se dibuja dos veces: uno oscuro y grueso, y uno
// claro y fino encima, para dar sensación de brillo.
export function Hanger({ size = 56 }: HangerProps) {
  return (
    <Svg width={size} height={(size * 38) / 64} viewBox="0 0 64 38">
      <Path d={HOOK} stroke={COLORS.metalDark} strokeWidth={3.4} strokeLinecap="round" fill="none" />
      <Path d={HOOK} stroke={COLORS.metalLight} strokeWidth={1.6} strokeLinecap="round" fill="none" />
      <Path d={BODY} stroke={COLORS.metalDark} strokeWidth={3.4} strokeLinejoin="round" fill="none" />
      <Path d={BODY} stroke={COLORS.metalLight} strokeWidth={1.6} strokeLinejoin="round" fill="none" />
    </Svg>
  );
}