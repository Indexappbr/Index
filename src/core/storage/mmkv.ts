import { createMMKV } from 'react-native-mmkv';

import { StorageKeys } from '@/core/storage/keys';

/**
 * MMKV — storage chave-valor síncrono (~10x mais rápido que AsyncStorage).
 *
 * - `sessionStorage`: namespace isolado para a sessão do Supabase.
 * - `appStorage`: dados não-sensíveis do app (profile, prefs, cache de billing).
 *
 * Itens realmente sensíveis (tokens crus, chave de cripto de áudio) vão no
 * `expo-secure-store` (ver secure-storage.ts). Encriptação at-rest da própria
 * MMKV fica para a fase de security hardening (plano §8).
 */
export const sessionStorage = createMMKV({ id: StorageKeys.SupabaseSession });

export const appStorage = createMMKV({ id: 'index-app' });
