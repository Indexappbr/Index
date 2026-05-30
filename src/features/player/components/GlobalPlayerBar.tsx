import { router } from 'expo-router';
import { Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { usePlayerStore } from '../store/player-store';
import { PlayerBar } from './PlayerBar';

/** Altura aproximada da tab bar nativa (sem o inset inferior). */
const TAB_BAR_HEIGHT = Platform.select({ ios: 49, android: 64, default: 49 });

/**
 * Mini-player global: fica fixo acima da tab bar nativa e persiste entre as
 * abas (Home/Biblioteca/Estante/Conta). Tocar na barra abre o livro atual.
 * Na tela de detalhe do livro o PlayerBar próprio (no rodapé) assume.
 */
export function GlobalPlayerBar() {
  const insets = useSafeAreaInsets();
  const currentChapter = usePlayerStore((s) => s.currentChapter);
  const book = usePlayerStore((s) => s.book);

  if (!currentChapter) return null;

  const openBook = () => {
    if (book) router.push(`/livro/${book.slug || book.id}`);
  };

  return (
    <View
      pointerEvents="box-none"
      style={{ position: 'absolute', left: 0, right: 0, bottom: insets.bottom + TAB_BAR_HEIGHT }}>
      <PlayerBar onPressBar={openBook} />
    </View>
  );
}
