import { createClient } from '@supabase/supabase-js';

import { env } from '@/core/config/env';
import { logger } from '@/core/logger';
import { sessionStorage } from '@/core/storage/mmkv';

/**
 * Adapter de storage do Supabase usando MMKV (síncrono, rápido).
 * Substitui o localStorage usado no app web — que não existe em RN.
 */
const mmkvStorageAdapter = {
  getItem: (key: string) => sessionStorage.getString(key) ?? null,
  setItem: (key: string, value: string) => sessionStorage.set(key, value),
  removeItem: (key: string) => {
    sessionStorage.remove(key);
  },
};

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

export const supabase = createClient(url, anonKey, {
  auth: {
    storage: mmkvStorageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // RN não tem URL bar
  },
});
