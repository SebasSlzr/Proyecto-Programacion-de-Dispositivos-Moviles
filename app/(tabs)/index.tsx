import { View, ScrollView } from 'react-native';
import { ScreenHeader } from '../../src/components/ui/ScreenHeader';
import { GarmentCard } from '../../src/components/ui/GarmentCard';
import { mockGarments } from '../../src/data/mockGarments';

export default function ArmarioScreen() {
  return (
    <ScrollView className="flex-1 bg-linen" contentContainerStyle={{ padding: 20, paddingTop: 60 }}>
      <ScreenHeader title="Tu armario" subtitle={`${mockGarments.length} prendas guardadas`} />
      <View className="flex-row flex-wrap justify-between mt-6">
        {mockGarments.map((garment) => (
          <GarmentCard key={garment.id} garment={garment} />
        ))}
      </View>
    </ScrollView>
  );
}