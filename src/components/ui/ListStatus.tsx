import type { ReactNode } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { COLORS } from '@/constants/theme';

type ListStatusProps = {
  isLoading: boolean;
  error: string | null;
  isEmpty: boolean;
  emptyTitle: string;
  emptyDescription: string;
  children?: ReactNode;
};

// Decide qué mostrar en una lista: cargando, error, vacío, o el contenido.
export function ListStatus({ isLoading, error, isEmpty, emptyTitle, emptyDescription, children }: ListStatusProps) {
  if (isLoading) {
    return <ActivityIndicator color={COLORS.plum} style={{ marginTop: 40 }} />;
  }

  if (error) {
    return <Text className="font-body text-red-500 text-center mt-10">{error}</Text>;
  }

  if (isEmpty) {
    return (
      <View className="items-center mt-16 px-8">
        <Text className="font-display text-xl text-ink text-center">{emptyTitle}</Text>
        <Text className="font-body text-ink/60 text-sm text-center mt-2">{emptyDescription}</Text>
      </View>
    );
  }

  return <>{children}</>;
}