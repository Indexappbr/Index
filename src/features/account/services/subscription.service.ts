import { supabase } from '@/core/supabase/client';

import type { SubscriptionInfo } from '../types';

interface CheckSubscriptionResponse {
  subscribed?: boolean;
  product_id?: string | null;
  plan_type?: SubscriptionInfo['planType'];
  stale_jwt?: boolean;
}

/**
 * Consulta a edge `check-subscription` (backend autoritativo). Se o JWT estiver
 * defasado mas o DB indicar assinatura ativa, refresca a sessão uma vez pra que
 * próximas chamadas (signed-audio-url etc) peguem o claim correto.
 */
export async function checkSubscription(): Promise<SubscriptionInfo> {
  const { data, error } = await supabase.functions.invoke<CheckSubscriptionResponse>(
    'check-subscription',
  );
  if (error) throw error;

  const info: SubscriptionInfo = {
    subscribed: data?.subscribed ?? false,
    productId: data?.product_id ?? null,
    planType: data?.plan_type ?? null,
  };

  if (data?.stale_jwt && info.subscribed) {
    try {
      await supabase.auth.refreshSession();
    } catch {
      // refresh best-effort; não bloqueia a tela.
    }
  }

  return info;
}
