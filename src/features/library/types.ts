import type { Tables } from '@/core/supabase/types';

/** Linhas cruas das views (todos os campos são nullable nas views públicas). */
export type BookRow = Tables<'books_public'>;
export type ChapterRow = Tables<'chapters_public'>;

/** Modelo de domínio normalizado — campos essenciais não-nulos. */
export interface Book {
  id: string;
  title: string;
  subtitle: string | null;
  slug: string;
  authors: string[];
  coverUrl: string | null;
  coverThumbUrl: string | null;
  isFree: boolean;
  language: string;
  categories: string[];
  description: string | null;
  durationSeconds: number;
}

export interface Chapter {
  id: string;
  bookId: string;
  title: string;
  orderIndex: number;
  lengthSeconds: number;
  isLocked: boolean;
}

export function mapBook(row: BookRow): Book {
  return {
    id: row.id ?? '',
    title: row.title ?? 'Sem título',
    subtitle: row.subtitle,
    slug: row.slug ?? '',
    authors: row.authors ?? [],
    coverUrl: row.cover_url,
    coverThumbUrl: row.cover_thumb_url ?? row.cover_url,
    isFree: row.is_free ?? false,
    language: row.language ?? 'pt',
    categories: row.categories ?? [],
    description: row.description,
    durationSeconds: row.duration_seconds ?? 0,
  };
}

export function mapChapter(row: ChapterRow): Chapter {
  return {
    id: row.id ?? '',
    bookId: row.book_id ?? '',
    title: row.title ?? '',
    orderIndex: row.order_index ?? 0,
    lengthSeconds: row.length_seconds ?? 0,
    isLocked: row.is_locked ?? false,
  };
}
