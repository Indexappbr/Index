import { mapBook, mapChapter } from '@/features/library/types';

describe('mapBook', () => {
  it('normaliza uma linha completa', () => {
    const book = mapBook({
      id: 'b1',
      title: 'Confissões',
      subtitle: 'Santo Agostinho',
      slug: 'confissoes',
      authors: ['Agostinho'],
      cover_url: 'http://x/c.jpg',
      cover_thumb_url: 'http://x/t.jpg',
      is_free: true,
      language: 'pt',
      categories: ['classicos'],
      description: 'desc',
      duration_seconds: 3600,
    } as never);

    expect(book.id).toBe('b1');
    expect(book.title).toBe('Confissões');
    expect(book.coverThumbUrl).toBe('http://x/t.jpg');
    expect(book.isFree).toBe(true);
    expect(book.durationSeconds).toBe(3600);
  });

  it('aplica defaults seguros quando campos são nulos', () => {
    const book = mapBook({ id: 'b2' } as never);
    expect(book.title).toBe('Sem título');
    expect(book.authors).toEqual([]);
    expect(book.isFree).toBe(false);
    expect(book.language).toBe('pt');
    expect(book.durationSeconds).toBe(0);
  });

  it('usa cover_url como thumb quando não há thumb', () => {
    const book = mapBook({ id: 'b3', cover_url: 'http://x/c.jpg' } as never);
    expect(book.coverThumbUrl).toBe('http://x/c.jpg');
  });
});

describe('mapChapter', () => {
  it('normaliza e aplica defaults', () => {
    const ch = mapChapter({ id: 'c1', book_id: 'b1', order_index: 2, is_locked: true } as never);
    expect(ch.id).toBe('c1');
    expect(ch.bookId).toBe('b1');
    expect(ch.orderIndex).toBe(2);
    expect(ch.isLocked).toBe(true);
    expect(ch.lengthSeconds).toBe(0);
    expect(ch.title).toBe('');
  });
});
