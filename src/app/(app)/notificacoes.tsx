import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Linking, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  getPermissionStatus,
  isPushEnabledLocally,
  type PermissionStatus,
  registerForPush,
  setPushDisabled,
} from '@/features/notifications/service';

export default function NotificacoesScreen() {
  const [status, setStatus] = useState<PermissionStatus>('undetermined');
  const [enabled, setEnabled] = useState(() => isPushEnabledLocally());
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void getPermissionStatus().then(setStatus);
  }, []);

  const handleToggle = async (value: boolean) => {
    setBusy(true);
    try {
      if (value) {
        const token = await registerForPush();
        const next = await getPermissionStatus();
        setStatus(next);
        if (token) {
          setEnabled(true);
        } else {
          setEnabled(false);
          if (next === 'denied') {
            Alert.alert(
              'Permissão negada',
              'Ative as notificações nos Ajustes do sistema para receber alertas.',
              [
                { text: 'Agora não', style: 'cancel' },
                { text: 'Abrir Ajustes', onPress: () => void Linking.openSettings() },
              ],
            );
          }
        }
      } else {
        setPushDisabled();
        setEnabled(false);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black" edges={['bottom']}>
      <Stack.Screen options={{ headerShown: true, title: 'Notificações' }} />
      <View className="gap-4 p-5">
        <View className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <View className="flex-row items-center justify-between gap-3">
            <View className="flex-1">
              <Text className="text-base font-semibold text-zinc-900 dark:text-white">
                Receber notificações
              </Text>
              <Text className="pt-1 text-sm text-zinc-500">
                Alertas sobre novos audiolivros e novidades.
              </Text>
            </View>
            <Switch value={enabled} onValueChange={handleToggle} disabled={busy} />
          </View>
        </View>

        {status === 'denied' ? (
          <Text className="px-1 text-sm text-amber-600 dark:text-amber-400">
            As notificações estão bloqueadas nos Ajustes do sistema. Ative por lá para receber
            alertas.
          </Text>
        ) : null}

        <Text className="px-1 text-xs text-zinc-400">
          O envio de notificações está sendo finalizado no servidor. Sua preferência já fica salva.
        </Text>
      </View>
    </SafeAreaView>
  );
}
