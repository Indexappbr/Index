import { z } from 'zod';

import { logger } from '@/core/logger';

/**
 * Validação das variáveis de ambiente públicas (prefixo EXPO_PUBLIC_).
 * São inlined pelo Metro em build. A anon key do Supabase é pública por design.
 * Segredos de verdade (service_role, chaves de assinatura) NUNCA entram aqui —
 * ficam em EAS Secrets / edge functions.
 */
const EnvSchema = z.object({
  supabaseUrl: z.string().url().optional(),
  supabaseAnonKey: z.string().min(1).optional(),
  appEnv: z.enum(['development', 'preview', 'production']).default('development'),
});

export type Env = z.infer<typeof EnvSchema>;

const parsed = EnvSchema.safeParse({
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  appEnv: process.env.EXPO_PUBLIC_APP_ENV,
});

if (!parsed.success) {
  logger.error('[env] Variáveis de ambiente inválidas:', parsed.error.flatten().fieldErrors);
}

export const env: Env = parsed.success ? parsed.data : { appEnv: 'development' };

/**
 * Use em pontos que dependem do Supabase. Lança erro claro se as vars
 * ainda não foram configuradas (em vez de falhar silenciosamente).
 */
export function requireSupabaseEnv(): { url: string; anonKey: string } {
  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    throw new Error(
      'Supabase env ausente: defina EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY no .env',
    );
  }
  return { url: env.supabaseUrl, anonKey: env.supabaseAnonKey };
}
