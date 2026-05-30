import { supabase } from '@/core/supabase/client';
import { type Book, mapBook } from '@/features/library/types';

import {
  type BibliaData,
  type BibliaSection,
  NEW_TESTAMENT_SECTIONS,
  OLD_TESTAMENT_SECTIONS,
} from '../types';

/**
 * Monta a Bíblia a partir das categorias `biblia-*` → `book_categories` →
 * `books_public`, agrupando nas seções fixas dos dois testamentos. Espelha o
 * `useBiblia` do web.
 */
export async function fetchBiblia(): Promise<BibliaData> {
  // 1. Categorias da Bíblia, ativas, em ordem.
  const { data: cats, error: catsErr } = await supabase
    .from('categories')
    .select('id, name, slug')
    .ilike('slug', 'biblia-%')
    .eq('is_active', true)
    .order('order_index');
  if (catsErr) throw catsErr;
  if (!cats || cats.length === 0) return { oldTestament: [], newTestament: [] };

  const catIds = cats.map((c) => c.id);

  // 2. Vínculos categoria↔livro, em ordem.
  const { data: links, error: linksErr } = await supabase
    .from('book_categories')
    .select('category_id, book_id, order_index')
    .in('category_id', catIds)
    .order('order_index');
  if (linksErr) throw linksErr;

  // 3. Livros (apenas publicados — books_public já filtra).
  const bookIds = [...new Set((links ?? []).map((l) => l.book_id))];
  const booksMap = new Map<string, Book>();
  if (bookIds.length > 0) {
    const { data: books, error: booksErr } = await supabase
      .from('books_public')
      .select('*')
      .in('id', bookIds);
    if (booksErr) throw booksErr;
    for (const row of books ?? []) {
      if (row.id) booksMap.set(row.id, mapBook(row));
    }
  }

  // Agrupa livros por categoria, preservando a ordem dos vínculos.
  const byCategory = new Map<string, Book[]>();
  for (const link of links ?? []) {
    const book = booksMap.get(link.book_id);
    if (!book) continue;
    const arr = byCategory.get(link.category_id) ?? [];
    arr.push(book);
    byCategory.set(link.category_id, arr);
  }

  const slugToId = new Map(cats.map((c) => [c.slug, c.id]));
  const build = (sections: readonly { title: string; slug: string }[]): BibliaSection[] =>
    sections
      .map((s) => {
        const id = slugToId.get(s.slug);
        return { title: s.title, slug: s.slug, books: id ? (byCategory.get(id) ?? []) : [] };
      })
      .filter((s) => s.books.length > 0);

  return {
    oldTestament: build(OLD_TESTAMENT_SECTIONS),
    newTestament: build(NEW_TESTAMENT_SECTIONS),
  };
}
