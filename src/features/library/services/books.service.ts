import { supabase } from '@/core/supabase/client';

import { type Book, type Chapter, mapBook, mapChapter } from '../types';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Catálogo de livros publicados (view books_public já filtra por publicado). */
export async function fetchBooks(): Promise<Book[]> {
  const { data, error } = await supabase
    .from('books_public')
    .select('*')
    .order('published_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).filter((r) => r.id && r.title).map(mapBook);
}

/**
 * Busca um livro por slug OU id. Espelha o web: só consulta por id quando o
 * parâmetro parece UUID (evita 400 quando é slug).
 */
export async function fetchBook(idOrSlug: string): Promise<Book | null> {
  const isUuid = UUID_RE.test(idOrSlug);
  const [bySlug, byId] = await Promise.all([
    supabase.from('books_public').select('*').eq('slug', idOrSlug).maybeSingle(),
    isUuid
      ? supabase.from('books_public').select('*').eq('id', idOrSlug).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const row = bySlug.data ?? byId.data;
  return row ? mapBook(row) : null;
}

/** Capítulos de um livro, em ordem. */
export async function fetchChapters(bookId: string): Promise<Chapter[]> {
  const { data, error } = await supabase
    .from('chapters_public')
    .select('*')
    .eq('book_id', bookId)
    .order('order_index');

  if (error) throw error;
  return (data ?? []).filter((r) => r.id).map(mapChapter);
}
