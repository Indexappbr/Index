import { Stack, router } from 'expo-router';
import { ActivityIndicator, Alert, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useQueryClient } from '@tanstack/react-query';

import { useSubscription } from '@/features/account/hooks/use-subscription';
import { useOfferings, usePurchase, useRestore } from '@/features/billing/hooks/use-billing';
import type { BillingPackage } from '@/features/billing/provider';
import { Button } from '@/shared/components/Button';

const BENEFITS = [
  'Acesso a todo o catálogo de audiolivros',
  'Bíblia Sagrada em áudio',
  'Ouça em segundo plano e na tela de bloqueio',
  'Novos títulos toda semana',
];

function PlanCard({
  pkg,
  disabled,
  onPress,
  loading,
}: {
  pkg: BillingPackage;
  disabled: boolean;
  onPress: () => void;
  loading: boolean;
}) {
  return (
    <View
      className={`gap-3 rounded-2xl border p-4 ${
        pkg.highlight
          ? 'border-brand bg-brand/5'
          : 'border-zinc-200 dark:border-zinc-800'
      }`}>
      <View className="flex-row items-center justify-between">
        <Text className="text-lg font-bold text-zinc-900 dark:text-white">{pkg.title}</Text>
        {pkg.highlight ? (
          <View className="rounded-full bg-brand px-2.5 py-0.5">
            <Text className="text-xs font-bold text-white">Melhor valor</Text>
          </View>
        ) : null}
      </View>
      <Text className="text-2xl font-bold text-zinc-900 dark:text-white">{pkg.priceLabel}</Text>
      <Button
        testID={`btn-buy-${pkg.id}`}
        label={disabled ? 'Em breve' : `Assinar ${pkg.title}`}
        onPress={onPress}
        loading={loading}
        disabled={disabled}
        variant={pkg.highlight ? 'primary' : 'ghost'}
      />
    </View>
  );
}

export default function AssinarScreen() {
  const { data: sub, isLoading: subLoading } = useSubscription();
  const { data: packages, isLoading, available } = useOfferings();
  const { purchase, pending } = usePurchase();
  const restore = useRestore();
  const queryClient = useQueryClient();

  const handlePurchase = async (pkg: BillingPackage) => {
    const res = await purchase(pkg);
    if (res.success) {
      await queryClient.invalidateQueries({ queryKey: ['subscription'] });
      Alert.alert('Tudo certo!', 'Sua assinatura está ativa.');
      router.back();
    } else if (res.error) {
      Alert.alert('Não foi possível assinar', res.error);
    }
  };

  const handleRestore = async () => {
    const res = await restore.restore();
    if (res.restored) {
      await queryClient.invalidateQueries({ queryKey: ['subscription'] });
      Alert.alert('Compras restauradas', 'Sua assinatura foi reativada.');
    } else {
      Alert.alert('Nada para restaurar', res.error ?? 'Nenhuma compra anterior encontrada.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black" edges={['bottom']}>
      <Stack.Screen options={{ headerShown: true, title: 'INDEX Premium' }} />

      {subLoading ? (
        <ActivityIndicator className="pt-10" />
      ) : sub?.subscribed ? (
        /* Já é assinante (inclusive quem assinou no web). */
        <View className="flex-1 items-center justify-center gap-3 px-8">
          <Text className="text-5xl">✓</Text>
          <Text className="text-center text-xl font-bold text-zinc-900 dark:text-white">
            Você já tem o INDEX Premium
          </Text>
          <Text className="text-center text-sm text-zinc-500">
            Aproveite todo o catálogo. Obrigado por apoiar a INDEX!
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
          <View className="gap-1">
            <Text className="text-2xl font-bold text-zinc-900 dark:text-white">
              Desbloqueie tudo
            </Text>
            <Text className="text-sm text-zinc-500">
              Assine o INDEX Premium e ouça sem limites.
            </Text>
          </View>

          <View className="gap-2">
            {BENEFITS.map((b) => (
              <View key={b} className="flex-row items-center gap-2">
                <Text className="text-brand">✓</Text>
                <Text className="flex-1 text-sm text-zinc-700 dark:text-zinc-200">{b}</Text>
              </View>
            ))}
          </View>

          {!available ? (
            <View className="rounded-xl bg-amber-400/10 p-3">
              <Text className="text-sm text-amber-700 dark:text-amber-400">
                As compras pelo app estão sendo finalizadas. Se você já assina pelo site, é só
                entrar com a mesma conta que o acesso é liberado.
              </Text>
            </View>
          ) : null}

          {isLoading ? (
            <ActivityIndicator />
          ) : (
            (packages ?? []).map((pkg) => (
              <PlanCard
                key={pkg.id}
                pkg={pkg}
                disabled={!available || pending}
                loading={pending}
                onPress={() => void handlePurchase(pkg)}
              />
            ))
          )}

          <Button
            label="Restaurar compras"
            variant="ghost"
            onPress={() => void handleRestore()}
            loading={restore.pending}
          />

          <Text className="px-2 text-center text-xs text-zinc-400">
            A assinatura renova automaticamente. Você pode gerenciar ou cancelar a qualquer momento
            nos Ajustes da sua conta na loja.
          </Text>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
