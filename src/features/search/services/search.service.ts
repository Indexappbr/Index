import { supabase } from '@/core/supabase/client';
import { type Book, type BookRow, mapBook } from '@/features/library/types';

/**
 * Busca via edge function `search` (FTS pt + filtros, rate-limited).
 * Espelha o web: POST { query, page, per_page }. Resposta: { results, total }.
 */
export async function searchBooks(query: string): Promise<Book[]> {
  const { data, error } = await supabase.functions.invoke('search', {
    body: { query, page: 1, per_page: 30 },
  });

  if (error) throw new Error(error.message ?? 'Falha na busca.');

  const results = (data as { results?: BookRow[] } | null)?.results ?? [];
  return results.filter((r) => r.id && r.title).map(mapBook);
}
