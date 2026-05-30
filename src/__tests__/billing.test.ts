import { billingConfigured, getBillingProvider } from '@/features/billing/provider';

describe('billing provider (stub)', () => {
  const provider = getBillingProvider();

  it('não está disponível em modo stub', () => {
    expect(provider.available).toBe(false);
  });

  it('expõe os planos mensal e anual', async () => {
    const pkgs = await provider.getPackages();
    expect(pkgs.map((p) => p.id)).toEqual(['monthly', 'annual']);
    expect(pkgs.find((p) => p.id === 'annual')?.highlight).toBe(true);
  });

  it('purchase rejeita em modo stub', async () => {
    const pkgs = await provider.getPackages();
    await expect(provider.purchase(pkgs[0])).rejects.toThrow();
  });

  it('restore não restaura nada em modo stub', async () => {
    await expect(provider.restore()).resolves.toEqual({ restored: false });
  });

  it('billingConfigured é false sem chaves do RevenueCat', () => {
    expect(billingConfigured).toBe(false);
  });
});
