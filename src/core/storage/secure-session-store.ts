import * as aesjs from 'aes-js';
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import { sessionStorage } from '@/core/storage/mmkv';

/**
 * Storage da sessão do Supabase com criptografia at-rest (padrão recomendado
 * pelo Supabase para Expo). Para cada chave:
 *  - gera uma chave AES-256 aleatória, guardada no `expo-secure-store`
 *    (Keychain no iOS / Keystore no Android — protegido por hardware);
 *  - cifra o valor (AES-CTR) e guarda só o texto cifrado na MMKV.
 *
 * Vantagem sobre o secure-store cru: tokens nunca ficam em texto plano e não
 * esbarram no limite de ~2KB do Keychain (a sessão do Supabase costuma passar).
 *
 * Na web (apenas alvo de validação/bundle) o secure-store não existe, então
 * caímos no MMKV puro — o app real é mobile.
 */

function secureKey(key: string): string {
  // expo-secure-store aceita [A-Za-z0-9._-]; trocamos o resto por '_'.
  return `sbsess_${key.replace(/[^A-Za-z0-9._-]/g, '_')}`;
}

async function encrypt(key: string, value: string): Promise<string> {
  const encryptionKey = Crypto.getRandomBytes(256 / 8); // Uint8Array(32)
  const cipher = new aesjs.ModeOfOperation.ctr(encryptionKey, new aesjs.Counter(1));
  const encryptedBytes = cipher.encrypt(aesjs.utils.utf8.toBytes(value));
  await SecureStore.setItemAsync(secureKey(key), aesjs.utils.hex.fromBytes(encryptionKey));
  return aesjs.utils.hex.fromBytes(encryptedBytes);
}

async function decrypt(key: string, cipherTextHex: string): Promise<string | null> {
  const keyHex = await SecureStore.getItemAsync(secureKey(key));
  if (!keyHex) return null;
  const cipher = new aesjs.ModeOfOperation.ctr(aesjs.utils.hex.toBytes(keyHex), new aesjs.Counter(1));
  const decryptedBytes = cipher.decrypt(aesjs.utils.hex.toBytes(cipherTextHex));
  return aesjs.utils.utf8.fromBytes(decryptedBytes);
}

const isWeb = Platform.OS === 'web';

/** Adapter compatível com a interface de storage do supabase-js (async ok). */
export const secureSessionStore = {
  getItem: async (key: string): Promise<string | null> => {
    const stored = sessionStorage.getString(key);
    if (!stored) return null;
    if (isWeb) return stored;
    try {
      return await decrypt(key, stored);
    } catch {
      // Chave perdida/corrompida → trata como sem sessão (força novo login).
      return null;
    }
  },

  setItem: async (key: string, value: string): Promise<void> => {
    const toStore = isWeb ? value : await encrypt(key, value);
    sessionStorage.set(key, toStore);
  },

  removeItem: async (key: string): Promise<void> => {
    sessionStorage.remove(key);
    if (!isWeb) {
      try {
        await SecureStore.deleteItemAsync(secureKey(key));
      } catch {
        // já ausente — ignora
      }
    }
  },
};
