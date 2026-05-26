import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

import { isSupabaseConfigured, supabase } from '@/core/supabase/client';

// Necessário para o navegador concluir a sessão de auth ao voltar para o app.
WebBrowser.maybeCompleteAuthSession();

/** Extrai pares chave/valor do fragmento (#) ou query (?) de uma URL de retorno. */
function parseRedirectParams(url: string): Record<string, string> {
  const raw = url.includes('#') ? url.split('#')[1] : (url.split('?')[1] ?? '');
  const params: Record<string, string> = {};
  for (const part of raw.split('&')) {
    if (!part) continue;
    const [key, value] = part.split('=');
    if (key) params[decodeURIComponent(key)] = decodeURIComponent(value ?? '');
  }
  return params;
}

export type GoogleSignInResult = { ok: true } | { ok: false; canceled?: boolean; error?: string };

/**
 * Login com Google via Supabase OAuth + expo-auth-session.
 * O redirect URI usa o scheme do app (definido por variante no app.config.ts).
 * Em sucesso, grava a sessão no Supabase (que persiste via MMKV) — o
 * onAuthStateChange no AuthProvider dispara o redirect do guard.
 */
export async function signInWithGoogle(): Promise<GoogleSignInResult> {
  if (!isSupabaseConfigured) {
    return { ok: false, error: 'Supabase não configurado — preencha o .env.' };
  }

  const redirectTo = AuthSession.makeRedirectUri();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo, skipBrowserRedirect: true },
  });

  if (error) return { ok: false, error: error.message };
  if (!data.url) return { ok: false, error: 'URL de autenticação não retornada pelo Supabase.' };

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

  if (result.type !== 'success') {
    return { ok: false, canceled: true };
  }

  const params = parseRedirectParams(result.url);
  const accessToken = params.access_token;
  const refreshToken = params.refresh_token;

  if (!accessToken || !refreshToken) {
    return { ok: false, error: 'Tokens ausentes no retorno do OAuth.' };
  }

  const { error: setError } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  if (setError) return { ok: false, error: setError.message };

  return { ok: true };
}
