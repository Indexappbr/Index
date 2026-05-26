import { isSupabaseConfigured, supabase } from '@/core/supabase/client';

function ensureConfigured() {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase não configurado — preencha EXPO_PUBLIC_SUPABASE_* no .env.');
  }
}

/**
 * Operações de autenticação por email/senha. Retornam o formato { data, error }
 * do supabase-js; as telas decidem como exibir o erro.
 */
export const authService = {
  getSession() {
    return supabase.auth.getSession();
  },

  signInWithPassword(email: string, password: string) {
    ensureConfigured();
    return supabase.auth.signInWithPassword({ email, password });
  },

  signUp(email: string, password: string) {
    ensureConfigured();
    return supabase.auth.signUp({ email, password });
  },

  signOut() {
    ensureConfigured();
    return supabase.auth.signOut();
  },

  resetPassword(email: string) {
    ensureConfigured();
    return supabase.auth.resetPasswordForEmail(email);
  },
};
