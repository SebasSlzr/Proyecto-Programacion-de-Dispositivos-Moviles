import { ScrollView } from 'react-native';
import { ScreenHeader } from '../../src/components/ui/ScreenHeader';
import { EmptyState } from '../../src/components/ui/EmptyState';

export default function WishlistScreen() {
  return (
    <ScrollView className="flex-1 bg-linen" contentContainerStyle={{ padding: 20, paddingTop: 60, flexGrow: 1 }}>
      <ScreenHeader title="Lista de deseos" />
      <EmptyState
        icon="heart-outline"
        title="Tu lista de deseos está vacía"
        description="Guarda prendas que veas en tiendas o en Instagram para no perderlas de vista."
      />
    </ScrollView>
  );
}