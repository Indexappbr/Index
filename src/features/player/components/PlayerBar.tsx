import { Pressable, Text, View } from 'react-native';

import { formatDuration } from '@/shared/utils/format';

import { usePlayerStore } from '../store/player-store';

/**
 * Barra de reprodução. Usada tanto na tela do livro quanto no mini-player
 * global (ver GlobalPlayerBar). `onPressBar`, se passado, torna a área de
 * texto tocável — o botão de play continua independente.
 */
export function PlayerBar({ onPressBar }: { onPressBar?: () => void }) {
  const currentChapter = usePlayerStore((s) => s.currentChapter);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const isLoading = usePlayerStore((s) => s.isLoading);
  const currentTime = usePlayerStore((s) => s.currentTime);
  const duration = usePlayerStore((s) => s.duration);
  const togglePlay = usePlayerStore((s) => s.togglePlay);

  if (!currentChapter) return null;

  const pct = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <View className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <View className="h-0.5 w-full bg-zinc-200 dark:bg-zinc-800">
        <View style={{ width: `${pct}%` }} className="h-0.5 bg-brand" />
      </View>
      <View className="flex-row items-center gap-3 px-4 py-3">
        <Pressable
          className="flex-1 active:opacity-60"
          disabled={!onPressBar}
          onPress={onPressBar}
          accessibilityRole={onPressBar ? 'button' : 'text'}
          accessibilityLabel={
            onPressBar ? `Tocando: ${currentChapter.title}. Abrir player` : currentChapter.title
          }>
          <Text numberOfLines={1} className="text-sm font-medium text-zinc-900 dark:text-white">
            {currentChapter.title}
          </Text>
          <Text className="text-xs text-zinc-400">
            {formatDuration(currentTime)} / {formatDuration(duration)}
          </Text>
        </Pressable>
        <Pressable
          onPress={togglePlay}
          accessibilityRole="button"
          accessibilityLabel={isPlaying ? 'Pausar' : 'Reproduzir'}
          accessibilityState={{ busy: isLoading }}
          className="h-11 w-11 items-center justify-center rounded-full bg-brand active:opacity-80">
          <Text className="text-base text-white">{isLoading ? '⏳' : isPlaying ? '⏸' : '▶'}</Text>
        </Pressable>
      </View>
    </View>
  );
}
