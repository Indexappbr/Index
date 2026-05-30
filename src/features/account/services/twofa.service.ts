import { supabase } from '@/core/supabase/client';

/**
 * Cliente da edge `two-factor-auth` (ações por path: setup | verify | disable).
 * TOTP RFC6238; o segredo fica cifrado (AES-256-GCM) no backend.
 */
async function callTwoFactor<T>(action: 'setup' | 'verify' | 'disable', body?: object): Promise<T> {
  const { data, error } = await supabase.functions.invoke<T & { error?: string }>(
    `two-factor-auth/${action}`,
    {
      body: body ? JSON.stringify(body) : undefined,
      headers: { 'Content-Type': 'application/json' },
    },
  );
  if (error) throw new Error(error.message || 'Erro na função de 2FA');
  if (data && (data as { error?: string }).error) throw new Error((data as { error: string }).error);
  return data as T;
}

/** Inicia o setup; retorna o `otpauth://` URI pra registrar no autenticador. */
export function setupTwoFactor() {
  return callTwoFactor<{ otpauth_uri: string }>('setup');
}

/** Confirma o código de 6 dígitos e ativa o 2FA. */
export function verifyTwoFactor(code: string) {
  return callTwoFactor<{ success?: boolean }>('verify', { code });
}

/** Desativa o 2FA (exige um código válido). */
export function disableTwoFactor(code: string) {
  return callTwoFactor<{ success?: boolean }>('disable', { code });
}

/** Extrai o segredo base32 do otpauth URI (pra entrada manual no autenticador). */
export function parseSecret(otpauthUri: string): string | null {
  const match = otpauthUri.match(/[?&]secret=([^&]+)/i);
  return match ? decodeURIComponent(match[1]) : null;
}
