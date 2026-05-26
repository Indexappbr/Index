/**
 * Chaves de storage centralizadas. Evita strings mágicas espalhadas e
 * deixa explícito o que é MMKV (não-sensível) vs expo-secure-store (sensível).
 */
export const StorageKeys = {
  /** Namespace da instância MMKV que guarda a sessão do Supabase. */
  SupabaseSession: 'supabase-session',
  Profile: 'profile',
  Roles: 'roles',
  ThemePreference: 'theme-preference',
  BillingCache: 'billing-cache',
} as const;

export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys];

/** Chaves que vivem no expo-secure-store (Keychain/Keystore). */
export const SecureKeys = {
  AccessToken: 'access-token',
  RefreshToken: 'refresh-token',
  /** Chave de criptografia dos áudios baixados (device-bound). */
  AudioEncryptionKey: 'audio-encryption-key',
} as const;

export type SecureKey = (typeof SecureKeys)[keyof typeof SecureKeys];
