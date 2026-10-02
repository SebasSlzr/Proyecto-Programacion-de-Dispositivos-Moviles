import { Text } from 'react-native';

type FormErrorProps = { message?: string };

// Mensaje de error general de un formulario (p. ej. respuesta del backend).
export function FormError({ message }: FormErrorProps) {
  if (!message) return null;

  return (
    <Text className="font-body text-sm text-red-500 bg-red-50 rounded-2xl p-3 text-center">{message}</Text>
  );
}
