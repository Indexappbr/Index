import * as Clipboard from 'expo-clipboard';
import { Stack } from 'expo-router';
import { usePreventScreenCapture } from 'expo-screen-capture';
import { useState } from 'react';
import { ActivityIndicator, Alert, Linking, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useQueryClient } from '@tanstack/react-query';

import { useProfile } from '@/features/account/hooks/use-profile';
import {
  disableTwoFactor,
  parseSecret,
  setupTwoFactor,
  verifyTwoFactor,
} from '@/features/account/services/twofa.service';
import { Button } from '@/shared/components/Button';
import { TextField } from '@/shared/components/TextField';

function Card({ children }: { children: React.ReactNode }) {
  return (
    <View className="gap-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      {children}
    </View>
  );
}

export default function SegurancaScreen() {
  // Bloqueia screenshot/gravação de tela enquanto a chave/QR de 2FA está visível.
  usePreventScreenCapture();

  const { data: profile, isLoading } = useProfile();
  const queryClient = useQueryClient();

  const [otpauth, setOtpauth] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);

  const enabled = profile?.twofaEnabled ?? false;
  const secret = otpauth ? parseSecret(otpauth) : null;

  const refreshProfile = () =>
    queryClient.invalidateQueries({ queryKey: ['profile', profile?.id] });

  const handleStartSetup = async () => {
    setBusy(true);
    try {
      const { otpauth_uri } = await setupTwoFactor();
      setOtpauth(otpauth_uri);
    } catch (e) {
      Alert.alert('Erro', (e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const handleVerify = async () => {
    setBusy(true);
    try {
      await verifyTwoFactor(code.trim());
      await refreshProfile();
      setOtpauth(null);
      setCode('');
      Alert.alert('Pronto!', 'Verificação em duas etapas ativada.');
    } catch (e) {
      Alert.alert('Código inválido', (e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const handleDisable = async () => {
    setBusy(true);
    try {
      await disableTwoFactor(code.trim());
      await refreshProfile();
      setCode('');
      Alert.alert('2FA desativado', 'A verificação em duas etapas foi removida.');
    } catch (e) {
      Alert.alert('Código inválido', (e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const copySecret = async () => {
    if (secret) {
      await Clipboard.setStringAsync(secret);
      Alert.alert('Copiado', 'Chave copiada para a área de transferência.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black" edges={['bottom']}>
      <Stack.Screen options={{ headerShown: true, title: 'Segurança' }} />
      <View className="gap-4 p-5">
        <Text className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
          Verificação em duas etapas (2FA)
        </Text>

        {isLoading ? (
          <ActivityIndicator className="pt-6" />
        ) : enabled ? (
          /* ----- 2FA ATIVO: fluxo de desativação ----- */
          <Card>
            <View className="flex-row items-center gap-2">
              <View className="h-2.5 w-2.5 rounded-full bg-green-500" />
              <Text className="text-base font-semibold text-zinc-900 dark:text-white">
                2FA ativado
              </Text>
            </View>
            <Text className="text-sm text-zinc-500">
              Para desativar, digite um código atual do seu app autenticador.
            </Text>
            <TextField
              label="Código de 6 dígitos"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              maxLength={6}
              placeholder="000000"
            />
            <Button
              label="Desativar 2FA"
              variant="ghost"
              onPress={handleDisable}
              loading={busy}
              disabled={code.trim().length < 6}
            />
          </Card>
        ) : otpauth ? (
          /* ----- SETUP INICIADO: registrar + confirmar ----- */
          <Card>
            <Text className="text-sm text-zinc-600 dark:text-zinc-300">
              1. Adicione a conta ao seu app autenticador (Google Authenticator, Authy…):
            </Text>
            <Button
              label="Abrir no app autenticador"
              onPress={() => void Linking.openURL(otpauth)}
            />
            {secret ? (
              <View className="gap-1">
                <Text className="text-xs text-zinc-400">Ou insira esta chave manualmente:</Text>
                <Text
                  selectable
                  onPress={copySecret}
                  className="rounded-lg bg-zinc-100 p-2.5 text-center font-mono text-base tracking-widest text-zinc-900 dark:bg-zinc-900 dark:text-white">
                  {secret}
                </Text>
                <Text className="text-center text-xs text-brand" onPress={copySecret}>
                  Toque para copiar
                </Text>
              </View>
            ) : null}
            <Text className="pt-1 text-sm text-zinc-600 dark:text-zinc-300">
              2. Digite o código gerado para confirmar:
            </Text>
            <TextField
              label="Código de 6 dígitos"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              maxLength={6}
              placeholder="000000"
            />
            <Button
              label="Confirmar e ativar"
              onPress={handleVerify}
              loading={busy}
              disabled={code.trim().length < 6}
            />
          </Card>
        ) : (
          /* ----- INATIVO: iniciar setup ----- */
          <Card>
            <Text className="text-base font-semibold text-zinc-900 dark:text-white">
              Proteja sua conta
            </Text>
            <Text className="text-sm text-zinc-500">
              Adicione uma camada extra de segurança exigindo um código do seu app autenticador ao
              entrar.
            </Text>
            <Button label="Ativar 2FA" onPress={handleStartSetup} loading={busy} />
          </Card>
        )}
      </View>
    </SafeAreaView>
  );
}
