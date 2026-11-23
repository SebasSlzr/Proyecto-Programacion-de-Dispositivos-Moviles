import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ModalHeader } from '@/components/ui/ModalHeader';
import { STRINGS } from '@/constants/strings';

const TEXT = STRINGS.privacy;

// Política de privacidad en secciones cortas. Se abre con y sin sesión
// (desde el registro y desde el drawer). Todo el texto está en STRINGS.privacy.
export default function PrivacyPolicyScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-linen">
      <ModalHeader title={TEXT.title} subtitle={TEXT.subtitle} />

      <ScrollView contentContainerStyle={{ gap: 16, padding: 24, paddingBottom: insets.bottom + 40 }}>
        {TEXT.sections.map((section) => (
          <View key={section.title} className="gap-2 rounded-2xl border border-taupe bg-ivory p-4">
            <Text accessibilityRole="header" className="font-display text-lg text-ink">
              {section.title}
            </Text>
            {section.body.map((paragraph) => (
              <Text key={paragraph} className="font-body text-base leading-6 text-ink">
                {paragraph}
              </Text>
            ))}
          </View>
        ))}

        <View className="gap-1 rounded-2xl border border-taupe bg-ivory p-4">
          <Text accessibilityRole="header" className="font-display text-lg text-ink">
            {TEXT.contactLabel}
          </Text>
          <Text selectable className="font-body-medium text-base text-walnut">
            {TEXT.contactEmail}
          </Text>
        </View>

        <Text className="px-2 text-center font-body text-xs text-ink-muted">{TEXT.disclaimer}</Text>
      </ScrollView>
    </View>
  );
}
