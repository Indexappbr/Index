import { Link } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { isSupabaseConfigured } from '@/core/supabase/client';
import { authService } from '@/features/auth/services/auth.service';
import { Button } from '@/shared/components/Button';
import { TextField } from '@/shared/components/TextField';

export default function ResetPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleReset() {
    setLoading(true);
    const { error } = await authService.resetPassword(email.trim());
    setLoading(false);
    if (error) {
      Alert.alert('Erro', error.message);
      return;
    }
    setSent(true);
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 justify-center gap-6 px-6">
        <View className="gap-2">
          <Text className="text-3xl font-bold text-zinc-900 dark:text-white">Recuperar senha</Text>
          <Text className="text-base text-zinc-500">
            Enviaremos um link de redefinição para seu e-mail.
          </Text>
        </View>

        {sent ? (
          <View className="rounded-xl bg-green-100 p-4">
            <Text className="text-sm text-green-800">
              Se existir uma conta com esse e-mail, o link de redefinição já está a caminho.
            </Text>
          </View>
        ) : (
          <View className="gap-4">
            <TextField
              label="E-mail"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              placeholder="voce@email.com"
            />
            <Button
              label="Enviar link"
              onPress={handleReset}
              loading={loading}
              disabled={!isSupabaseConfigured}
            />
          </View>
        )}

        <View className="flex-row justify-center">
          <Link href="/login" className="font-medium text-brand">
            Voltar para o login
          </Link>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
