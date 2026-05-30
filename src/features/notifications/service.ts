import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { logger } from '@/core/logger';
import { appStorage } from '@/core/storage/mmkv';
import { StorageKeys } from '@/core/storage/keys';

/**
 * Camada de notificações (expo-notifications). Cobre a base do cliente:
 * permissão, canal Android, obtenção do Expo push token e roteamento ao tocar.
 *
 * NOTA: a persistência do token no backend e o envio real no iOS dependem de
 * APNs (credencial Apple via EAS) + um sender Expo/FCM nas edge functions. O
 * `push-send` atual é Web-Push (VAPID) e não entrega a tokens nativos. Por isso
 * aqui só cacheamos o token localmente — ligar no backend é passo posterior.
 */

const projectId = '574f3ee8-6671-4dbc-9826-2ccaa982db26';

/** Exibe a notificação mesmo com o app em primeiro plano. */
export function configureNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export type PermissionStatus = 'granted' | 'denied' | 'undetermined';

export async function getPermissionStatus(): Promise<PermissionStatus> {
  const { status } = await Notifications.getPermissionsAsync();
  return status as PermissionStatus;
}

/**
 * Pede permissão (se ainda não decidida), configura o canal Android e obtém o
 * Expo push token. Retorna o token ou null (negado / não é device físico).
 */
export async function registerForPush(): Promise<string | null> {
  if (!Device.isDevice) {
    logger.warn('[push] push só funciona em device físico');
    return null;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Padrão',
      importance: Notifications.AndroidImportance.DEFAULT,
      lightColor: '#208AEF',
    });
  }

  const existing = await Notifications.getPermissionsAsync();
  let status = existing.status;
  if (status !== 'granted') {
    const req = await Notifications.requestPermissionsAsync();
    status = req.status;
  }
  if (status !== 'granted') return null;

  try {
    const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });
    appStorage.set(StorageKeys.PushToken, token);
    appStorage.set(StorageKeys.PushEnabled, 'true');
    return token;
  } catch (e) {
    logger.error('[push] getExpoPushTokenAsync', e);
    return null;
  }
}

/** Marca a intenção de desativar push (local). A revogação real é no SO. */
export function setPushDisabled() {
  appStorage.set(StorageKeys.PushEnabled, 'false');
}

export function isPushEnabledLocally(): boolean {
  return appStorage.getString(StorageKeys.PushEnabled) === 'true';
}

/** Extrai um destino de navegação do payload da notificação, se houver. */
export function routeFromNotification(
  data: Record<string, unknown> | undefined,
): string | null {
  if (!data) return null;
  if (typeof data.url === 'string') return data.url;
  if (typeof data.bookSlug === 'string') return `/livro/${data.bookSlug}`;
  return null;
}
