import { Pressable, Text } from 'react-native';

import { useFavoritesStore } from '../store/favorites-store';

/**
 * Botão de favoritar (coração). Lê só o pedaço do estado relativo a este
 * livro, então não re-renderiza quando outros favoritos mudam.
 */
export function FavoriteButton({ bookId, size = 22 }: { bookId: string; size?: number }) {
  const isFav = useFavoritesStore((s) => s.favorites.includes(bookId));
  const toggle = useFavoritesStore((s) => s.toggle);

  return (
    <Pressable
      onPress={() => void toggle(bookId)}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      className="h-11 w-11 items-center justify-center rounded-full active:opacity-60">
      <Text style={{ fontSize: size }}>{isFav ? '❤️' : '🤍'}</Text>
    </Pressable>
  );
}
