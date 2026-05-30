import { useEffect } from 'react';
import { Alert, Platform } from 'react-native';

import { appStorage } from '@/core/storage/mmkv';
import { StorageKeys } from '@/core/storage/keys';

import { isDeviceCompromised } from '../jailbreak';

/**
 * Mostra um aviso (uma única vez) se o aparelho aparentar estar comprometido.
 * Não bloqueia o uso — só alerta. Montar uma vez na área autenticada.
 */
export function useJailbreakWarning() {
  useEffect(() => {
    if (Platform.OS === 'web') return;
    if (appStorage.getString(StorageKeys.JailbreakWarned) === 'true') return;

    if (isDeviceCompromised()) {
      appStorage.set(StorageKeys.JailbreakWarned, 'true');
      Alert.alert(
        'Dispositivo comprometido',
        'Detectamos sinais de jailbreak/root neste aparelho. Por segurança, alguns recursos podem ficar indisponíveis.',
      );
    }
  }, []);
}
