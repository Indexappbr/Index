import { useQuery } from '@tanstack/react-query';

import { searchBooks } from '../services/search.service';

/** Busca de livros (habilita a partir de 2 caracteres). */
export function useSearchBooks(query: string) {
  const trimmed = query.trim();
  return useQuery({
    queryKey: ['search', trimmed],
    queryFn: () => searchBooks(trimmed),
    enabled: trimmed.length >= 2,
  });
}
