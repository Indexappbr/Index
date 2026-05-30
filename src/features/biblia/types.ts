import type { Book } from '@/features/library/types';

export interface BibliaSection {
  title: string;
  slug: string;
  books: Book[];
}

export interface BibliaData {
  oldTestament: BibliaSection[];
  newTestament: BibliaSection[];
}

/** Seções fixas, na ordem litúrgica (slugs das categorias `biblia-*`). */
export const OLD_TESTAMENT_SECTIONS = [
  { title: 'Pentateuco', slug: 'biblia-pentateuco' },
  { title: 'Livros Históricos', slug: 'biblia-historicos' },
  { title: 'Livros Poéticos e Sapienciais', slug: 'biblia-poeticos' },
  { title: 'Profetas Maiores', slug: 'biblia-profetas-maiores' },
  { title: 'Profetas Menores', slug: 'biblia-profetas-menores' },
] as const;

export const NEW_TESTAMENT_SECTIONS = [
  { title: 'Evangelhos', slug: 'biblia-evangelhos' },
  { title: 'Atos dos Apóstolos', slug: 'biblia-atos' },
  { title: 'Cartas Paulinas', slug: 'biblia-cartas-paulinas' },
  { title: 'Cartas Católicas', slug: 'biblia-cartas-catolicas' },
  { title: 'Apocalipse', slug: 'biblia-apocalipse' },
] as const;
