import { env } from '@/core/config/env';

/**
 * Camada de billing por trás de uma interface — hoje em **modo stub**, sem o
 * módulo nativo (`react-native-purchases`). Quando a conta Apple estiver ativa,
 * basta: (1) `npx expo install react-native-purchases`, (2) adicionar o plugin
 * no app.config, (3) trocar `getBillingProvider()` para o provider real (modelo
 * comentado no fim deste arquivo). O resto do app (paywall, hooks, Conta) já
 * consome esta interface — não muda nada.
 *
 * Regra App Store: o upgrade dentro do app DEVE ser via IAP nativo. NÃO linkar
 * o checkout web (Cakto) dentro do iOS. Quem assinou no web mantém acesso por
 * login (a edge `check-subscription` é autoritativa — ver useSubscription).
 */

export interface BillingPackage {
  id: string;
  title: string;
  /** Preço já formatado para exibição (vem da store quando o IAP estiver ativo). */
  priceLabel: string;
  period: 'monthly' | 'annual';
  highlight?: boolean;
}

export interface BillingProvider {
  /** Se as compras nativas estão disponíveis (chaves + módulo configurados). */
  readonly available: boolean;
  /** Configura o SDK e associa o usuário (appUserID = Supabase user.id). */
  configure(userId: string): Promise<void>;
  /** Planos disponíveis para compra. */
  getPackages(): Promise<BillingPackage[]>;
  /** Inicia a compra de um plano. */
  purchase(pkg: BillingPackage): Promise<{ success: boolean }>;
  /** Restaura compras anteriores (obrigatório na App Store). */
  restore(): Promise<{ restored: boolean }>;
}

// Planos de exibição (espelham os preços do web; quando o IAP entrar, os
// preços passam a vir da App Store / Play Store).
const STUB_PACKAGES: BillingPackage[] = [
  { id: 'monthly', title: 'Mensal', priceLabel: 'R$ 24,90/mês', period: 'monthly' },
  { id: 'annual', title: 'Anual', priceLabel: 'R$ 197/ano', period: 'annual', highlight: true },
];

/** Provider stub: mostra os planos, mas a compra ainda não está habilitada. */
const stubBillingProvider: BillingProvider = {
  available: false,
  async configure() {
    /* no-op */
  },
  async getPackages() {
    return STUB_PACKAGES;
  },
  async purchase() {
    throw new Error('As compras pelo app ainda não estão disponíveis.');
  },
  async restore() {
    return { restored: false };
  },
};

/** True quando há chaves do RevenueCat configuradas (apenas indicativo por ora). */
export const billingConfigured = Boolean(env.revenueCatIosKey || env.revenueCatAndroidKey);

/**
 * Retorna o provider ativo. Hoje sempre o stub. Para ativar o IAP real, trocar
 * por `revenueCatProvider` (ver modelo abaixo) — é a ÚNICA mudança necessária.
 */
export function getBillingProvider(): BillingProvider {
  return stubBillingProvider;
}

/*
 * ───────────────────────────────────────────────────────────────────────────
 * MODELO — provider real com RevenueCat (descomentar + instalar a lib):
 *
 *   import Purchases, { PurchasesPackage } from 'react-native-purchases';
 *   import { Platform } from 'react-native';
 *
 *   const apiKey = Platform.OS === 'ios' ? env.revenueCatIosKey : env.revenueCatAndroidKey;
 *
 *   const revenueCatProvider: BillingProvider = {
 *     available: Boolean(apiKey),
 *     async configure(userId) {
 *       if (!apiKey) return;
 *       Purchases.configure({ apiKey, appUserID: userId });
 *     },
 *     async getPackages() {
 *       const offerings = await Purchases.getOfferings();
 *       const pkgs = offerings.current?.availablePackages ?? [];
 *       return pkgs.map((p: PurchasesPackage) => ({
 *         id: p.identifier,
 *         title: p.product.title,
 *         priceLabel: p.product.priceString,
 *         period: p.packageType === 'ANNUAL' ? 'annual' : 'monthly',
 *         highlight: p.packageType === 'ANNUAL',
 *       }));
 *     },
 *     async purchase(pkg) {
 *       const offerings = await Purchases.getOfferings();
 *       const target = offerings.current?.availablePackages.find((p) => p.identifier === pkg.id);
 *       if (!target) throw new Error('Plano indisponível.');
 *       const { customerInfo } = await Purchases.purchasePackage(target);
 *       // O webhook do RevenueCat atualiza a tabela subscriptions; o JWT reflete depois.
 *       return { success: Object.keys(customerInfo.entitlements.active).length > 0 };
 *     },
 *     async restore() {
 *       const info = await Purchases.restorePurchases();
 *       return { restored: Object.keys(info.entitlements.active).length > 0 };
 *     },
 *   };
 *
 *   export function getBillingProvider() { return revenueCatProvider; }
 * ───────────────────────────────────────────────────────────────────────────
 */
