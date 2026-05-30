import { Link } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { isSupabaseConfigured } from '@/core/supabase/client';
import { authService } from '@/features/auth/services/auth.service';
import { signInWithGoogle } from '@/features/auth/services/google-auth';
import { Button } from '@/shared/components/Button';
import { TextField } from '@/shared/components/TextField';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    const { error } = await authService.signInWithPassword(email.trim(), password);
    setLoading(false);
    if (error) {
      Alert.alert('Não foi possível entrar', error.message);
    }
    // Em caso de sucesso, o guard em _layout redireciona automaticamente.
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    const result = await signInWithGoogle();
    setGoogleLoading(false);
    if (!result.ok && !result.canceled) {
      Alert.alert('Falha no login com Google', result.error ?? 'Tente novamente.');
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 justify-center gap-6 px-6">
        <View className="gap-2">
          <Text className="text-3xl font-bold text-zinc-900 dark:text-white">Entrar</Text>
          <Text className="text-base text-zinc-500">Acesse sua conta INDEX</Text>
        </View>

        {!isSupabaseConfigured ? (
          <View className="rounded-xl bg-amber-100 p-3">
            <Text className="text-sm text-amber-800">
              Supabase não configurado — preencha o .env para habilitar o login.
            </Text>
          </View>
        ) : null}

        <View className="gap-4">
          <TextField
            testID="input-email"
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            placeholder="voce@email.com"
          />
          <TextField
            testID="input-password"
            label="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="••••••••"
          />
          <Button
            testID="btn-login"
            label="Entrar"
            onPress={handleLogin}
            loading={loading}
            disabled={!isSupabaseConfigured}
          />
        </View>

        <View className="flex-row items-center gap-3">
          <View className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
          <Text className="text-xs text-zinc-400">ou</Text>
          <View className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
        </View>

        <Button
          label="Continuar com Google"
          variant="ghost"
          onPress={handleGoogle}
          loading={googleLoading}
          disabled={!isSupabaseConfigured}
        />

        <View className="flex-row justify-between">
          <Link href="/reset-password" className="font-medium text-brand">
            Esqueci a senha
          </Link>
          <Link href="/register" className="font-medium text-brand">
            Criar conta
          </Link>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
