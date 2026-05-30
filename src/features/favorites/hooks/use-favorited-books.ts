import { useMemo } from 'react';

import { useBooks } from '@/features/library/hooks/use-books';

import { useFavoritesStore } from '../store/favorites-store';

/**
 * Livros favoritados, na ordem em que aparecem no catálogo. Reaproveita o
 * cache de `useBooks` (TanStack) — não faz request extra.
 */
export function useFavoritedBooks() {
  const { data: books, isLoading, error } = useBooks();
  const favorites = useFavoritesStore((s) => s.favorites);

  const data = useMemo(() => {
    if (!books) return [];
    const favSet = new Set(favorites);
    return books.filter((b) => favSet.has(b.id));
  }, [books, favorites]);

  return { data, isLoading, error };
}
