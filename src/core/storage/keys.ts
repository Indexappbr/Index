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
  /** IDs dos livros favoritados (cache local, espelha a tabela `favorites`). */
  Favorites: 'favorites',
  /** Intenção do usuário de receber push (toggle local). */
  PushEnabled: 'push-enabled',
  /** Último Expo push token obtido (cache; persistência no backend é futura). */
  PushToken: 'push-token',
  /** Marca que o aviso de device comprometido (jailbreak/root) já foi exibido. */
  JailbreakWarned: 'jailbreak-warned',
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
