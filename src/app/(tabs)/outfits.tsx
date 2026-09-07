import { ScrollView } from 'react-native';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { EmptyState } from '../../components/ui/EmptyState';

export default function OutfitsScreen() {
  return (
    <ScrollView className="flex-1 bg-linen" contentContainerStyle={{ padding: 20, paddingTop: 60, flexGrow: 1 }}>
      <ScreenHeader title="Outfits" />
      <EmptyState
        icon="sparkles-outline"
        title="Aún no has armado ningún outfit"
        description="Cuando esté listo el generador de combinaciones, tus outfits van a aparecer acá."
      />
    </ScrollView>
  );
}