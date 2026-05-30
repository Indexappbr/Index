import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LEGAL_LINKS } from '@/core/config/constants';
import { authService } from '@/features/auth/services/auth.service';
import { useAvatarUpload } from '@/features/account/hooks/use-avatar-upload';
import { useProfile, useUpdateProfile } from '@/features/account/hooks/use-profile';
import { useSubscription } from '@/features/account/hooks/use-subscription';
import { Button } from '@/shared/components/Button';
import { TextField } from '@/shared/components/TextField';

const SETTINGS_ROWS = [
  { href: '/notificacoes', emoji: '🔔', title: 'Notificações', subtitle: 'Push e preferências' },
  { href: '/seguranca', emoji: '🔒', title: 'Segurança', subtitle: 'Verificação em duas etapas' },
] as const;

function Card({ children }: { children: React.ReactNode }) {
  return (
    <View className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      {children}
    </View>
  );
}

function SubscriptionCard() {
  const { data: sub, isLoading } = useSubscription();

  const label = isLoading
    ? 'Verificando…'
    : sub?.subscribed
      ? sub.planType === 'annual'
        ? 'Plano anual ativo'
        : sub.planType === 'monthly'
          ? 'Plano mensal ativo'
          : 'Assinatura ativa'
      : 'Sem assinatura ativa';

  return (
    <Card>
      <Text className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Assinatura</Text>
      <View className="flex-row items-center gap-2 pt-1.5">
        <View
          className={`h-2.5 w-2.5 rounded-full ${sub?.subscribed ? 'bg-green-500' : 'bg-zinc-400'}`}
        />
        <Text className="text-base font-semibold text-zinc-900 dark:text-white">{label}</Text>
      </View>
    </Card>
  );
}

export default function ContaScreen() {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const avatar = useAvatarUpload();

  const handleAvatarPress = () => {
    avatar.pick().catch((e) => Alert.alert('Erro no upload', (e as Error).message));
  };

  const [fullName, setFullName] = useState('');
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName ?? '');
      setDisplayName(profile.displayName ?? '');
    }
  }, [profile]);

  const handleSave = () => {
    updateProfile.mutate(
      { fullName: fullName.trim(), displayName: displayName.trim() },
      {
        onSuccess: () => Alert.alert('Perfil atualizado', 'Suas alterações foram salvas.'),
        onError: (e) => Alert.alert('Erro ao salvar', (e as Error).message),
      },
    );
  };

  const handleLogout = () => {
    Alert.alert('Sair da conta', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: () => {
          void authService.signOut();
        },
      },
    ]);
  };

  const initials = (profile?.fullName || profile?.displayName || profile?.email || '?')
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black" edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40, gap: 16 }}>
        <View>
          <Text className="text-2xl font-bold text-zinc-900 dark:text-white">Minha Conta</Text>
        </View>

        {isLoading ? (
          <ActivityIndicator className="pt-8" />
        ) : (
          <>
            {/* Cartão do perfil */}
            <Card>
              <View className="flex-row items-center gap-3.5">
                <Pressable
                  onPress={handleAvatarPress}
                  accessibilityRole="button"
                  accessibilityLabel="Alterar foto de perfil"
                  accessibilityState={{ busy: avatar.uploading }}
                  className="active:opacity-70">
                  {profile?.avatarUrl ? (
                    <Image
                      source={profile.avatarUrl}
                      style={{
                        width: 62,
                        height: 62,
                        borderRadius: 31,
                        backgroundColor: '#e4e4e7',
                      }}
                      contentFit="cover"
                    />
                  ) : (
                    <View className="h-[62px] w-[62px] items-center justify-center rounded-full bg-brand/15">
                      <Text className="text-2xl font-bold text-brand">{initials}</Text>
                    </View>
                  )}
                  <View className="absolute bottom-0 right-0 h-5 w-5 items-center justify-center rounded-full bg-brand">
                    {avatar.uploading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text className="text-[10px] text-white">✎</Text>
                    )}
                  </View>
                </Pressable>
                <View className="flex-1">
                  <Text
                    className="text-lg font-bold text-zinc-900 dark:text-white"
                    numberOfLines={1}>
                    {profile?.fullName || profile?.displayName || 'Usuário'}
                  </Text>
                  <Text className="text-sm text-zinc-500" numberOfLines={1}>
                    {profile?.email ?? ''}
                  </Text>
                </View>
              </View>

              {profile?.isFounder ? (
                <View className="mt-3 self-start rounded-full bg-amber-400/15 px-3 py-1">
                  <Text className="text-xs font-bold text-amber-600 dark:text-amber-400">
                    ⭐ Membro Fundador #
                    {String(profile.founderNumber ?? 1).padStart(3, '0')}
                  </Text>
                </View>
              ) : null}
            </Card>

            {/* Assinatura */}
            <SubscriptionCard />

            {/* Ajustes */}
            <View className="gap-3">
              {SETTINGS_ROWS.map((row) => (
                <Link key={row.href} href={row.href} asChild>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`${row.title}: ${row.subtitle}`}
                    className="flex-row items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-4 active:opacity-70 dark:border-zinc-800 dark:bg-zinc-950">
                    <Text className="text-xl">{row.emoji}</Text>
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-zinc-900 dark:text-white">
                        {row.title}
                      </Text>
                      <Text className="text-sm text-zinc-500">{row.subtitle}</Text>
                    </View>
                    <Text className="text-lg text-zinc-400">›</Text>
                  </Pressable>
                </Link>
              ))}
            </View>

            {/* Editar perfil */}
            <Card>
              <Text className="pb-3 text-lg font-bold text-zinc-900 dark:text-white">
                Editar Perfil
              </Text>
              <View className="gap-3">
                <TextField
                  label="Nome completo"
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                />
                <TextField
                  label="Nome de exibição"
                  value={displayName}
                  onChangeText={setDisplayName}
                  autoCapitalize="words"
                />
                <TextField
                  label="E-mail"
                  value={profile?.email ?? ''}
                  editable={false}
                  className="opacity-60"
                />
                <Button
                  label="Salvar alterações"
                  onPress={handleSave}
                  loading={updateProfile.isPending}
                />
              </View>
            </Card>

            {/* Legal */}
            <View className="flex-row justify-center gap-4 pt-1">
              <Text
                accessibilityRole="link"
                onPress={() => void Linking.openURL(LEGAL_LINKS.terms)}
                className="text-sm text-zinc-500 underline">
                Termos de Uso
              </Text>
              <Text className="text-sm text-zinc-300">·</Text>
              <Text
                accessibilityRole="link"
                onPress={() => void Linking.openURL(LEGAL_LINKS.privacy)}
                className="text-sm text-zinc-500 underline">
                Privacidade
              </Text>
            </View>

            {/* Sair */}
            <Button label="Sair da conta" variant="ghost" onPress={handleLogout} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
