import { create } from 'zustand';

import { logger } from '@/core/logger';
import { appStorage } from '@/core/storage/mmkv';
import { StorageKeys } from '@/core/storage/keys';
import { supabase } from '@/core/supabase/client';

/**
 * Estado dos favoritos. Espelha o FavoritesContext do web:
 * - cache local imediato (MMKV) p/ funcionar offline e antes do login;
 * - no login, faz merge com o servidor via edge `sync-favorites`;
 * - toggle é otimista + grava direto na tabela `favorites` (com revert no erro).
 */
interface FavoritesState {
  favorites: string[];
  loading: boolean;
  isFavorite: (bookId: string) => boolean;
  toggle: (bookId: string) => Promise<void>;
  /** Faz o merge local↔servidor. Chamado quando o usuário autentica. */
  sync: () => Promise<void>;
  /** Limpa o estado em memória (mantém o cache local). Usado no logout. */
  reset: () => void;
}

function readLocal(): string[] {
  try {
    const raw = appStorage.getString(StorageKeys.Favorites);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

function writeLocal(ids: string[]) {
  appStorage.set(StorageKeys.Favorites, JSON.stringify(ids));
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: readLocal(),
  loading: false,

  isFavorite: (bookId) => get().favorites.includes(bookId),

  toggle: async (bookId) => {
    const adding = !get().favorites.includes(bookId);
    const next = adding
      ? [...get().favorites, bookId]
      : get().favorites.filter((id) => id !== bookId);

    // Atualização otimista (UI + cache local).
    set({ favorites: next });
    writeLocal(next);

    const { data } = await supabase.auth.getSession();
    const userId = data.session?.user.id;
    if (!userId) return; // Sem login: só local.

    try {
      if (adding) {
        const { error } = await supabase
          .from('favorites')
          .upsert(
            { user_id: userId, book_id: bookId },
            { onConflict: 'user_id,book_id', ignoreDuplicates: true },
          );
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('book_id', bookId);
        if (error) throw error;
      }
    } catch (e) {
      logger.warn('[favorites] toggle sync falhou, revertendo', e);
      const reverted = adding
        ? get().favorites.filter((id) => id !== bookId)
        : [...get().favorites, bookId];
      set({ favorites: reverted });
      writeLocal(reverted);
    }
  },

  sync: async () => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) return;

    set({ loading: true });
    try {
      const local = readLocal();
      const { data: res, error } = await supabase.functions.invoke<{ favorites: string[] }>(
        'sync-favorites',
        { body: { favorites: local }, headers: { Authorization: `Bearer ${token}` } },
      );
      if (error) throw error;
      if (res?.favorites) {
        set({ favorites: res.favorites });
        writeLocal(res.favorites);
      }
    } catch (e) {
      logger.warn('[favorites] sync falhou', e);
    } finally {
      set({ loading: false });
    }
  },

  reset: () => set({ favorites: readLocal(), loading: false }),
}));
