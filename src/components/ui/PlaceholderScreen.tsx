import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from './ScreenHeader';

type PlaceholderScreenProps = { title: string; subtitle?: string };

// Pantalla provisional de la Fase 0 V2: su dueño la reemplaza por la real.
export function PlaceholderScreen({ title, subtitle = 'En construcción' }: PlaceholderScreenProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-linen px-6" style={{ paddingTop: insets.top + 16 }}>
      {router.canGoBack() && (
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          className="self-end min-h-12 justify-center mb-2"
        >
          <Text className="font-body-medium text-plum">Volver</Text>
        </Pressable>
      )}
      <ScreenHeader title={title} subtitle={subtitle} />
    </View>
  );
}