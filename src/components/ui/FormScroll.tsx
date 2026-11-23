import type { PropsWithChildren } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type FormScrollProps = PropsWithChildren<{
  // Estilos del contenido (padding, gap...). Se suman a los de base y pueden reemplazarlos.
  contentContainerStyle?: StyleProp<ViewStyle>;
}>;

// Contenedor para cualquier formulario: el teclado nunca tapa los campos ni el botón de guardar.
// KeyboardAvoidingView empuja el contenido hacia arriba cuando sale el teclado y el ScrollView
// permite llegar al último campo. Así no se repite este código en cada formulario.
export function FormScroll({ children, contentContainerStyle }: FormScrollProps) {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        // Tocar un botón con el teclado abierto funciona al primer toque.
        keyboardShouldPersistTaps="handled"
        // Margen inferior seguro: el botón de guardar no queda debajo de la barra del sistema.
        contentContainerStyle={[{ flexGrow: 1, paddingBottom: insets.bottom + 40 }, contentContainerStyle]}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
