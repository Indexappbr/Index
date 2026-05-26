import * as SecureStore from 'expo-secure-store';

import type { SecureKey } from '@/core/storage/keys';

/**
 * Wrapper do expo-secure-store (Keychain no iOS / Keystore no Android).
 * Usar APENAS para segredos: tokens crus, chave de criptografia de áudio.
 * É assíncrono por natureza (acesso ao enclave seguro).
 */
export const secureStorage = {
  get(key: SecureKey): Promise<string | null> {
    return SecureStore.getItemAsync(key);
  },
  set(key: SecureKey, value: string): Promise<void> {
    return SecureStore.setItemAsync(key, value);
  },
  remove(key: SecureKey): Promise<void> {
    return SecureStore.deleteItemAsync(key);
  },
};
