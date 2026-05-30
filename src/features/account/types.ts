/** Perfil do usuário (subset da tabela `users` usado na tela de Conta). */
export interface Profile {
  id: string;
  email: string | null;
  fullName: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  isFounder: boolean;
  founderNumber: number | null;
  twofaEnabled: boolean;
}

export type PlanType = 'monthly' | 'annual';

/** Resposta da edge `check-subscription` (backend é autoritativo). */
export interface SubscriptionInfo {
  subscribed: boolean;
  productId: string | null;
  planType: PlanType | null;
}
