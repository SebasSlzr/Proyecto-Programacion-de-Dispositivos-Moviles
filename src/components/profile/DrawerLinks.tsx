import { Ionicons } from '@expo/vector-icons';
import { router, type Href } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { STRINGS } from '@/constants/strings';
import { COLORS } from '@/constants/theme';
import type { UserRole } from '@/types';

type DrawerLinksProps = {
  role: UserRole;
  onNavigate: () => void;   // cierra el drawer antes de abrir la pantalla
};

type LinkItem = { label: string; icon: keyof typeof Ionicons.glyphMap; href: Href };

// Enlaces al final del drawer. "Recordatorios" solo para usuarias (el admin no recibe
// recordatorios); "Política de privacidad" para los dos roles.
export function DrawerLinks({ role, onNavigate }: DrawerLinksProps) {
  const links: LinkItem[] = [
    ...(role === 'user'
      ? [{ label: STRINGS.drawerLinks.reminders, icon: 'notifications-outline' as const, href: '/settings/notifications' as const }]
      : []),
    { label: STRINGS.drawerLinks.privacy, icon: 'shield-checkmark-outline', href: '/privacy' },
  ];

  return (
    <View className="overflow-hidden rounded-2xl border border-taupe bg-ivory">
      {links.map((link, index) => (
        <Pressable
          key={link.label}
          onPress={() => {
            onNavigate();
            router.push(link.href);
          }}
          accessibilityRole="link"
          accessibilityLabel={link.label}
          className={`min-h-12 flex-row items-center gap-3 px-4 py-3 active:bg-linen ${
            index > 0 ? 'border-t border-taupe' : ''
          }`}
        >
          <Ionicons name={link.icon} size={20} color={COLORS.walnut} />
          <Text className="flex-1 font-body-medium text-base text-ink">{link.label}</Text>
          <Ionicons name="chevron-forward" size={18} color={COLORS.walnut} />
        </Pressable>
      ))}
    </View>
  );
}
