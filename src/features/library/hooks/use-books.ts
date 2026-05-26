import { useQuery } from '@tanstack/react-query';

import { fetchBook, fetchBooks, fetchChapters } from '../services/books.service';

export function useBooks() {
  return useQuery({ queryKey: ['books'], queryFn: fetchBooks });
}

export function useBook(idOrSlug: string) {
  return useQuery({
    queryKey: ['book', idOrSlug],
    queryFn: () => fetchBook(idOrSlug),
    enabled: Boolean(idOrSlug),
  });
}

export function useChapters(bookId: string | undefined) {
  return useQuery({
    queryKey: ['chapters', bookId],
    queryFn: () => fetchChapters(bookId as string),
    enabled: Boolean(bookId),
  });
}
