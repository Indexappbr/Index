import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { type BillingPackage, getBillingProvider } from '../provider';

const provider = getBillingProvider();

/** Planos disponíveis + se a compra está habilitada. */
export function useOfferings() {
  const query = useQuery({
    queryKey: ['billing', 'packages'],
    queryFn: () => provider.getPackages(),
    staleTime: 5 * 60_000,
  });
  return { ...query, available: provider.available };
}

/** Compra de um plano (estado local de loading/erro). */
export function usePurchase() {
  const [pending, setPending] = useState(false);

  async function purchase(pkg: BillingPackage): Promise<{ success: boolean; error?: string }> {
    setPending(true);
    try {
      return await provider.purchase(pkg);
    } catch (e) {
      return { success: false, error: (e as Error).message };
    } finally {
      setPending(false);
    }
  }

  return { purchase, pending };
}

/** Restaurar compras (obrigatório na App Store). */
export function useRestore() {
  const [pending, setPending] = useState(false);

  async function restore(): Promise<{ restored: boolean; error?: string }> {
    setPending(true);
    try {
      return await provider.restore();
    } catch (e) {
      return { restored: false, error: (e as Error).message };
    } finally {
      setPending(false);
    }
  }

  return { restore, pending };
}
