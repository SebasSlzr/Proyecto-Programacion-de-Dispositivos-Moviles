import { FlatList, Pressable, RefreshControl, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatTile } from '@/components/admin/StatTile';
import { GarmentCard } from '@/components/garments/GarmentCard';
import { OutfitCard } from '@/components/outfits/OutfitCard';
import { Badge } from '@/components/ui/Badge';
import { Chip } from '@/components/ui/Chip';
import { ListStatus } from '@/components/ui/ListStatus';
import { WoodSurface } from '@/components/ui/WoodSurface';
import { STRINGS } from '@/constants/strings';
import { COLORS } from '@/constants/theme';
import type { Garment, Outfit } from '@/types';
import { getInitials } from '@/utils/initials';
import { useAdminUserDetail } from './useAdminUserDetail';

// Detalle de un usuario para el administrador, en SOLO LECTURA:
// - Encabezado de madera con botón para volver, como el resto de la app.
// - Datos del usuario, conteos con StatTile y el aviso de privacidad con enlace.
// - Selector Prendas / Outfits con Chip y una FlatList de dos columnas que reutiliza
//   GarmentCard y OutfitCard sin onPress: no se abre ninguna edición.
// - Al final, eliminar la cuenta con el diálogo propio (tone 'danger').
export default function AdminUserDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const detail = useAdminUserDetail(id);
  const insets = useSafeAreaInsets();
  const user = detail.wardrobe?.user;

  const topBar = (
    <WoodSurface variant="walnut" bevel="bottom">
      <View className="flex-row items-center gap-3 px-5 pb-4" style={{ paddingTop: insets.top + 12 }}>
        <Pressable
          onPress={detail.goBack}
          accessibilityRole="button"
          accessibilityLabel={STRINGS.admin.back}
          className="w-12 h-12 rounded-full items-center justify-center border border-ivory/40 active:opacity-85"
        >
          <Ionicons name="chevron-back" size={22} color={COLORS.ivory} />
        </Pressable>
        <View className="flex-1">
          <Text className="font-display text-2xl text-ivory" numberOfLines={1}>
            {user?.name ?? STRINGS.admin.userDetail}
          </Text>
          <Text className="font-body text-sm text-ivory/80 mt-0.5" numberOfLines={1}>
            {user?.email ?? ''}
          </Text>
        </View>
      </View>
    </WoodSurface>
  );

  // Mientras carga, o si falló la primera carga, solo se muestra el estado.
  if (!detail.wardrobe || !user) {
    return (
      <View className="flex-1 bg-linen">
        {topBar}
        <ListStatus isLoading={detail.isLoading} error={detail.error} isEmpty={false} emptyTitle="" emptyDescription="" />
      </View>
    );
  }

  const { garments, outfits } = detail.wardrobe;
  const isAdmin = user.role === 'admin';
  const showGarments = detail.tab === 'garments';

  const header = (
    <View className="gap-4 mb-6">
      <View className="flex-row items-center gap-3">
        <View
          className={`w-14 h-14 rounded-full items-center justify-center ${isAdmin ? 'bg-plum' : 'bg-sage-dark'}`}
        >
          <Text className="font-body-bold text-ivory text-lg">{getInitials(user.name)}</Text>
        </View>
        <Badge label={isAdmin ? STRINGS.admin.roleAdmin : STRINGS.admin.roleUser} tone={isAdmin ? 'plum' : 'sage'} />
      </View>

      <View className="flex-row gap-3">
        <StatTile label={STRINGS.admin.statGarments} value={garments.length} icon="shirt-outline" />
        <StatTile label={STRINGS.admin.statOutfits} value={outfits.length} icon="layers-outline" />
      </View>

      {/* Aviso: el administrador ve datos personales, por eso se declara en la política. */}
      <View className="flex-row gap-3 bg-ivory border border-taupe rounded-2xl p-3">
        <Ionicons name="eye-outline" size={18} color={COLORS.inkMuted} />
        <Text className="flex-1 font-body text-xs text-ink-muted">
          {STRINGS.admin.readOnlyNotice}{' '}
          <Text
            onPress={detail.openPrivacy}
            accessibilityRole="link"
            className="font-body-bold text-walnut underline"
          >
            {STRINGS.admin.privacyLink}
          </Text>
          .
        </Text>
      </View>

      <View className="flex-row gap-2">
        <Chip
          label={`${STRINGS.admin.tabGarments} (${garments.length})`}
          selected={showGarments}
          onPress={() => detail.setTab('garments')}
        />
        <Chip
          label={`${STRINGS.admin.tabOutfits} (${outfits.length})`}
          selected={!showGarments}
          onPress={() => detail.setTab('outfits')}
        />
      </View>

      {!!detail.actionError && (
        <Text className="font-body text-sm text-danger bg-danger-soft rounded-2xl p-3 text-center">
          {detail.actionError}
        </Text>
      )}
    </View>
  );

  const footer = detail.canDelete ? (
    <Pressable
      onPress={detail.confirmDelete}
      accessibilityRole="button"
      className="mt-4 min-h-12 rounded-full border border-danger-border bg-danger-soft flex-row items-center justify-center gap-2 active:opacity-85"
    >
      <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
      <Text className="font-body-bold text-danger text-base">{STRINGS.admin.deleteUser}</Text>
    </Pressable>
  ) : undefined;

  // Props comunes a las dos listas: misma cuadrícula que el armario.
  const listProps = {
    numColumns: 2,
    columnWrapperStyle: { justifyContent: 'space-between' as const },
    contentContainerStyle: { padding: 20, paddingBottom: 32, flexGrow: 1 },
    ListHeaderComponent: header,
    ListFooterComponent: footer,
    refreshControl: (
      <RefreshControl refreshing={detail.isRefreshing} onRefresh={detail.onRefresh} tintColor={COLORS.walnut} />
    ),
  };

  return (
    <View className="flex-1 bg-linen">
      {topBar}

      {/* key distinta por pestaña: numColumns no puede cambiar con la lista montada,
          y así cada pestaña empieza arriba. */}
      {showGarments ? (
        <FlatList<Garment>
          key="garments"
          data={garments}
          keyExtractor={(garment) => garment.id}
          renderItem={({ item }) => (
            <View style={{ width: '48%' }}>
              <GarmentCard garment={item} />
            </View>
          )}
          ListEmptyComponent={
            <ListStatus
              isLoading={false}
              error={null}
              isEmpty
              emptyTitle={STRINGS.admin.emptyGarmentsTitle}
              emptyDescription={STRINGS.admin.emptyGarmentsDescription}
            />
          }
          {...listProps}
        />
      ) : (
        <FlatList<Outfit>
          key="outfits"
          data={outfits}
          keyExtractor={(outfit) => outfit.id}
          renderItem={({ item }) => (
            <View style={{ width: '48%' }}>
              <OutfitCard outfit={item} />
            </View>
          )}
          ListEmptyComponent={
            <ListStatus
              isLoading={false}
              error={null}
              isEmpty
              emptyTitle={STRINGS.admin.emptyOutfitsTitle}
              emptyDescription={STRINGS.admin.emptyOutfitsDescription}
            />
          }
          {...listProps}
        />
      )}
    </View>
  );
}
