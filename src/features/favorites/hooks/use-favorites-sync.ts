import { useEffect, useRef } from 'react';

import { useAuth } from '@/providers/AuthProvider';

import { useFavoritesStore } from '../store/favorites-store';

/**
 * Faz o merge dos favoritos com o servidor quando o usuário autentica
 * (uma vez por sessão). No logout, reseta o estado em memória.
 * Montar uma única vez na área autenticada.
 */
export function useFavoritesSync() {
  const { user } = useAuth();
  const sync = useFavoritesStore((s) => s.sync);
  const reset = useFavoritesStore((s) => s.reset);
  const syncedFor = useRef<string | null>(null);

  useEffect(() => {
    if (!user) {
      syncedFor.current = null;
      reset();
      return;
    }
    if (syncedFor.current === user.id) return;
    syncedFor.current = user.id;
    void sync();
  }, [user, sync, reset]);
}
