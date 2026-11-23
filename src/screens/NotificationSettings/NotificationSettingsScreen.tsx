import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/Button';
import { ModalHeader } from '@/components/ui/ModalHeader';
import { STRINGS } from '@/constants/strings';
import { COLORS } from '@/constants/theme';
import { useNotificationSettings } from './useNotificationSettings';

const TEXTS = STRINGS.notifications;
type Settings = ReturnType<typeof useNotificationSettings>;

type StepperProps = { label: string; value: number; onChange: (paso: 1 | -1) => void };

// Selector de hora sin librerías: subir y bajar, cada botón con 48 x 48 px de área táctil.
function Stepper({ label, value, onChange }: StepperProps) {
  return (
    <View className="items-center">
      <Pressable
        onPress={() => onChange(1)}
        accessibilityRole="button"
        accessibilityLabel={TEXTS.increase(label)}
        className="min-h-12 min-w-12 items-center justify-center rounded-full active:bg-linen"
      >
        <Ionicons name="chevron-up" size={24} color={COLORS.walnut} />
      </Pressable>
      <Text className="font-display text-3xl text-ink">{String(value).padStart(2, '0')}</Text>
      <Pressable
        onPress={() => onChange(-1)}
        accessibilityRole="button"
        accessibilityLabel={TEXTS.decrease(label)}
        className="min-h-12 min-w-12 items-center justify-center rounded-full active:bg-linen"
      >
        <Ionicons name="chevron-down" size={24} color={COLORS.walnut} />
      </Pressable>
    </View>
  );
}

type ToggleRowProps = {
  title: string;
  hint: string;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
};

function ToggleRow({ title, hint, value, onChange, disabled = false }: ToggleRowProps) {
  return (
    <View className="flex-row items-center gap-3">
      <View className="flex-1 gap-0.5">
        <Text className="font-body-bold text-base text-ink">{title}</Text>
        <Text className="font-body text-sm text-ink-muted">{hint}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        accessibilityLabel={title}
        trackColor={{ false: COLORS.taupe, true: COLORS.sageDark }}
        thumbColor={COLORS.ivory}
      />
    </View>
  );
}

// Lo de abajo cambia según el permiso: sin preguntar o negado, bloqueado o concedido.
function Content({ settings }: { settings: Settings }) {
  if (!settings.isSupported) {
    return <Text className="font-body text-sm text-ink-muted text-center">{TEXTS.webNotice}</Text>;
  }

  if (settings.permission === null) {
    return <ActivityIndicator color={COLORS.walnut} />;
  }

  if (settings.permission === 'blocked') {
    return (
      <View className="gap-3">
        <Text className="font-body text-sm text-ink">{TEXTS.blocked}</Text>
        <Button label={TEXTS.openSettings} onPress={settings.openSettings} />
      </View>
    );
  }

  if (settings.permission !== 'granted') {
    return (
      <View className="gap-3">
        <Button label={TEXTS.enable} onPress={settings.askPermission} />
        {settings.permission === 'denied' && (
          <Text className="font-body text-sm text-ink-muted text-center">{TEXTS.deniedHint}</Text>
        )}
      </View>
    );
  }

  const { daily } = settings;
  return (
    <View className="gap-4">
      <View className="gap-4 rounded-2xl border border-taupe bg-ivory p-4">
        <ToggleRow title={TEXTS.dailyTitle} hint={TEXTS.dailyHint} value={daily.enabled} onChange={settings.toggleDaily} />

        {daily.enabled && (
          <>
            <View className="flex-row items-center justify-center gap-2">
              <Stepper label={TEXTS.hour} value={daily.hour} onChange={(paso) => settings.changeTime('hour', paso)} />
              <Text className="font-display text-3xl text-ink">:</Text>
              <Stepper label={TEXTS.minute} value={daily.minute} onChange={(paso) => settings.changeTime('minute', paso)} />
            </View>
            <Text accessibilityLiveRegion="polite" className="text-center font-body-medium text-sm text-walnut">
              {settings.nextNotice}
            </Text>
            {settings.notEnoughGarments && <Text className="font-body text-sm text-ink-muted">{TEXTS.notEnough}</Text>}
          </>
        )}
      </View>

      <View className="rounded-2xl border border-taupe bg-ivory p-4">
        <ToggleRow
          title={TEXTS.wishlistTitle}
          hint={TEXTS.wishlistHint}
          value={settings.wishlistReminders}
          onChange={settings.toggleWishlist}
          disabled={settings.isSavingWishlist}
        />
      </View>
    </View>
  );
}

// Permiso en contexto: primero se explica para qué son los avisos y después se pide.
export default function NotificationSettingsScreen() {
  const insets = useSafeAreaInsets();
  const settings = useNotificationSettings();

  return (
    <View className="flex-1 bg-linen">
      <ModalHeader title={TEXTS.settingsTitle} subtitle={TEXTS.settingsSubtitle} />

      <ScrollView contentContainerStyle={{ gap: 16, padding: 24, paddingBottom: insets.bottom + 40 }}>
        <View className="flex-row gap-3 rounded-2xl border border-taupe bg-ivory p-4">
          <Ionicons name="notifications-outline" size={22} color={COLORS.walnut} />
          <Text className="flex-1 font-body text-base leading-6 text-ink">{TEXTS.why}</Text>
        </View>

        <Content settings={settings} />

        {!!settings.error && (
          <Text
            accessibilityLiveRegion="polite"
            className="rounded-2xl border border-danger-border bg-danger-soft p-3 text-center font-body text-sm text-danger"
          >
            {settings.error}
          </Text>
        )}
      </ScrollView>
    </View>
  );
}