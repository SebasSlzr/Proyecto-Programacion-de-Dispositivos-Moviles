import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { STRINGS } from '@/constants/strings';
import type { Garment } from '@/types';
import { sugerirOutfit, type OutfitSuggestion } from '@/utils/suggestOutfit';
import { NOTIFICATION_CHANNEL_ID, type PerchaNotificationData } from './channel';

const DIAS_PROGRAMADOS = 7;
const TEXTS = STRINGS.notifications.daily;

// Ciclo de vida: los nuestros se reconocen por data.kind, así no tocamos otros avisos.
function esOutfitDelDia(aviso: Notifications.NotificationRequest): boolean {
  const data = aviso.content.data as Partial<PerchaNotificationData> | undefined;
  return data?.kind === 'daily-outfit';
}

export async function cancelDailyOutfits(): Promise<void> {
  if (Platform.OS === 'web') return;
  const programados = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    programados.filter(esOutfitDelDia).map((aviso) => Notifications.cancelScheduledNotificationAsync(aviso.identifier)),
  );
}

// Los próximos días a la hora elegida; si hoy ya pasó esa hora, empieza mañana.
function proximasFechas(hour: number, minute: number, cantidad: number): Date[] {
  const ahora = new Date();
  const primera = new Date(ahora);
  primera.setHours(hour, minute, 0, 0);
  if (primera <= ahora) primera.setDate(primera.getDate() + 1);

  return Array.from({ length: cantidad }, (_, dia) => {
    const fecha = new Date(primera);
    fecha.setDate(primera.getDate() + dia);
    return fecha;
  });
}

// "Camiseta blanca, Jean azul y Tenis blancos"
function prendasEnTexto(sugerencia: OutfitSuggestion, porId: Map<string, Garment>): string {
  const ids = [sugerencia.head, ...sugerencia.torso, sugerencia.legs, sugerencia.feet];
  const nombres = ids.flatMap((id) => {
    const prenda = id ? porId.get(id) : undefined;
    return prenda ? [prenda.name] : [];
  });
  if (nombres.length <= 1) return nombres.join('');
  return `${nombres.slice(0, -1).join(', ')} y ${nombres[nombres.length - 1]}`;
}

// Parámetros de /outfit/new (contrato 6.5): todo texto, '' = no tiene, torso en JSON.
function paramsDe(sugerencia: OutfitSuggestion): Record<string, string> {
  return {
    head: sugerencia.head ?? '',
    torso: JSON.stringify(sugerencia.torso),
    legs: sugerencia.legs ?? '',
    feet: sugerencia.feet ?? '',
  };
}

// Programa 7 días, cada uno con un ancla distinta a la del día anterior. Devuelve cuántos programó
// (0 = no alcanzan las prendas para un outfit, y la pantalla lo explica).
export async function scheduleDailyOutfits(wardrobe: Garment[], hour: number, minute: number): Promise<number> {
  if (Platform.OS === 'web') return 0;
  await cancelDailyOutfits();

  const porId = new Map(wardrobe.map((prenda) => [prenda.id, prenda]));
  let anclaAnterior: string | undefined;
  let programados = 0;

  for (const fecha of proximasFechas(hour, minute, DIAS_PROGRAMADOS)) {
    const sugerencia =
      sugerirOutfit(wardrobe, { excluir: anclaAnterior ? [anclaAnterior] : [] }) ?? sugerirOutfit(wardrobe);
    if (!sugerencia) break;
    anclaAnterior = sugerencia.anchorId;

    const data: PerchaNotificationData = { kind: 'daily-outfit', url: '/outfit/new', params: paramsDe(sugerencia) };
    await Notifications.scheduleNotificationAsync({
      content: { title: TEXTS.title, body: TEXTS.body(prendasEnTexto(sugerencia, porId)), data },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: fecha, channelId: NOTIFICATION_CHANNEL_ID },
    });
    programados++;
  }
  return programados;
}