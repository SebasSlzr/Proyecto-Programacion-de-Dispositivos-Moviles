import type { ReactNode } from 'react';
import { Pressable, type Insets } from 'react-native';
import { WoodSurface } from './WoodSurface';

type WoodPressableProps = {
  onPress: () => void;
  disabled?: boolean;
  radius: number;              // esquinas: 999 para píldora, la mitad del lado para círculo
  className?: string;          // padding y alineación del contenido
  hitSlop?: Insets;            // amplía el área táctil sin cambiar el tamaño visible
  accessibilityLabel?: string; // para botones sin texto (solo ícono)
  children: ReactNode;
};

// Pieza base de los botones de madera (Button, AddButton, ProfileButton y
// el Chip seleccionado). Tiene los tres estados que pide el diseño:
// - Reposo: tabla de nogal con sombra.
// - Presionado (`active:` de Tailwind): se hunde 2 px y pierde la sombra,
//   como una tecla física.
// - Deshabilitado: opacidad 0.5 y no responde al toque.
export function WoodPressable({
  onPress,
  disabled = false,
  radius,
  className,
  hitSlop,
  accessibilityLabel,
  children,
}: WoodPressableProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={hitSlop}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      className={`active:translate-y-0.5 ${disabled ? 'opacity-50' : ''}`}
    >
      {/* La sombra es una prop de WoodSurface, no una clase: por eso se usa
          el `pressed` que Pressable le pasa a sus hijos. */}
      {({ pressed }) => (
        <WoodSurface variant="walnut" radius={radius} shadow={!pressed} className={className}>
          {children}
        </WoodSurface>
      )}
    </Pressable>
  );
}
