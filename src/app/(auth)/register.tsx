import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { isSupabaseConfigured } from '@/core/supabase/client';
import { authService } from '@/features/auth/services/auth.service';
import { Button } from '@/shared/components/Button';
import { TextField } from '@/shared/components/TextField';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (password !== confirm) {
      Alert.alert('Senhas diferentes', 'A confirmação não corresponde à senha.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Senha curta', 'Use ao menos 6 caracteres.');
      return;
    }

    setLoading(true);
    const { data, error } = await authService.signUp(email.trim(), password);
    setLoading(false);

    if (error) {
      Alert.alert('Não foi possível criar a conta', error.message);
      return;
    }

    // Se o projeto exigir confirmação por email, não há sessão ainda.
    if (!data.session) {
      Alert.alert(
        'Confirme seu e-mail',
        'Enviamos um link de confirmação. Após confirmar, faça login.',
        [{ text: 'OK', onPress: () => router.replace('/login') }],
      );
    }
    // Com sessão ativa, o guard redireciona automaticamente.
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 justify-center gap-6 px-6">
        <View className="gap-2">
          <Text className="text-3xl font-bold text-zinc-900 dark:text-white">Criar conta</Text>
          <Text className="text-base text-zinc-500">Comece a usar o INDEX</Text>
        </View>

        {!isSupabaseConfigured ? (
          <View className="rounded-xl bg-amber-100 p-3">
            <Text className="text-sm text-amber-800">
              Supabase não configurado — preencha o .env para habilitar o cadastro.
            </Text>
          </View>
        ) : null}

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
          <TextField
            label="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="mínimo 6 caracteres"
          />
          <TextField
            label="Confirmar senha"
            value={confirm}
            onChangeText={setConfirm}
            secureTextEntry
            placeholder="repita a senha"
          />
          <Button
            label="Criar conta"
            onPress={handleRegister}
            loading={loading}
            disabled={!isSupabaseConfigured}
          />
        </View>

        <View className="flex-row justify-center gap-1">
          <Text className="text-zinc-500">Já tem conta?</Text>
          <Link href="/login" className="font-medium text-brand">
            Entrar
          </Link>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
