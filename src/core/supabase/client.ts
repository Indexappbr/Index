import { createClient } from '@supabase/supabase-js';

import { env } from '@/core/config/env';
import { logger } from '@/core/logger';
import { secureSessionStore } from '@/core/storage/secure-session-store';
import type { Database } from '@/core/supabase/types';

/** True quando as variáveis de ambiente do Supabase estão presentes. */
export const isSupabaseConfigured = Boolean(env.supabaseUrl && env.supabaseAnonKey);

if (!isSupabaseConfigured) {
  logger.warn(
    '[supabase] EXPO_PUBLIC_SUPABASE_URL/ANON_KEY ausentes — auth desabilitada até configurar o .env',
  );
}

// Placeholders evitam que createClient lance no boot quando o .env ainda não
// foi preenchido. Guarde as chamadas de auth com `isSupabaseConfigured`.
const url = env.supabaseUrl ?? 'https://placeholder.supabase.co';
const anonKey = env.supabaseAnonKey ?? 'placeholder-anon-key';

export const supabase = createClient<Database>(url, anonKey, {
  auth: {
    // Sessão cifrada at-rest: chave AES no Keychain/Keystore, texto cifrado na
    // MMKV (ver secure-session-store). Tokens nunca ficam em texto plano.
    storage: secureSessionStore,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // RN não tem URL bar
  },
});
