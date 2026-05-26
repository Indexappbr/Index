import { type AudioPlayer, type AudioStatus, createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { create } from 'zustand';

import { PLAYBACK_SYNC_INTERVAL_MS } from '@/core/config/constants';
import { logger } from '@/core/logger';
import { supabase } from '@/core/supabase/client';
import type { Book, Chapter } from '@/features/library/types';

import { loadPosition, savePosition } from '../services/playback.service';
import { getSignedAudioUrl } from '../services/signed-url.service';

interface PlayerState {
  book: Book | null;
  chapters: Chapter[];
  currentIndex: number;
  currentChapter: Chapter | null;
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  error: string | null;

  /** Inicia a reprodução de um livro a partir de um capítulo. */
  playChapters: (book: Book, chapters: Chapter[], startIndex?: number) => Promise<void>;
  togglePlay: () => void;
  seekTo: (seconds: number) => void;
  skip: (seconds: number) => void;
  next: () => void;
  prev: () => void;
  stop: () => void;
}

// Singletons fora do estado reativo (a instância nativa não é serializável).
let player: AudioPlayer | null = null;
let statusSub: { remove: () => void } | null = null;
let userId: string | null = null;
let lastSaveAt = 0;

export const usePlayerStore = create<PlayerState>((set, get) => {
  async function ensurePlayer() {
    if (player) return;
    await setAudioModeAsync({
      shouldPlayInBackground: true,
      playsInSilentMode: true,
      interruptionMode: 'doNotMix',
    });
    player = createAudioPlayer(null, { updateInterval: 500 });
    statusSub = player.addListener('playbackStatusUpdate', (status: AudioStatus) => {
      const p = player;
      if (!p) return;
      set({ currentTime: status.currentTime ?? 0, duration: status.duration ?? 0, isPlaying: p.playing });

      const chapter = get().currentChapter;
      if (userId && chapter && p.playing) {
        const now = Date.now();
        if (now - lastSaveAt > PLAYBACK_SYNC_INTERVAL_MS) {
          lastSaveAt = now;
          void savePosition(userId, chapter.id, status.currentTime ?? 0).catch((e) =>
            logger.warn('[player] savePosition', e),
          );
        }
      }

      if (status.didJustFinish) {
        void loadChapterAt(get().currentIndex + 1);
      }
    });
  }

  async function loadChapterAt(index: number) {
    const { chapters, book } = get();
    const chapter = chapters[index];
    if (!chapter || !player) return;

    set({ isLoading: true, error: null, currentIndex: index, currentChapter: chapter, currentTime: 0 });

    try {
      const url = await getSignedAudioUrl(chapter.id);
      player.replace({ uri: url });

      if (userId) {
        const pos = await loadPosition(userId, chapter.id);
        if (pos > 2) {
          try {
            await player.seekTo(pos);
          } catch {
            // seek antes do load completo pode falhar; ignoramos
          }
        }
      }

      player.play();
      player.setActiveForLockScreen(
        true,
        {
          title: chapter.title,
          artist: book?.authors[0],
          albumTitle: book?.title,
          artworkUrl: book?.coverUrl ?? undefined,
        },
        { showSeekForward: true, showSeekBackward: true },
      );

      set({ isLoading: false, isPlaying: true });
    } catch (e) {
      logger.error('[player] loadChapterAt', e);
      set({ isLoading: false, error: (e as Error).message });
    }
  }

  return {
    book: null,
    chapters: [],
    currentIndex: -1,
    currentChapter: null,
    isPlaying: false,
    isLoading: false,
    currentTime: 0,
    duration: 0,
    error: null,

    playChapters: async (book, chapters, startIndex = 0) => {
      const { data } = await supabase.auth.getSession();
      userId = data.session?.user.id ?? null;
      set({ book, chapters });
      await ensurePlayer();
      await loadChapterAt(startIndex);
    },

    togglePlay: () => {
      if (!player) return;
      if (player.playing) {
        player.pause();
        set({ isPlaying: false });
        const chapter = get().currentChapter;
        if (userId && chapter) {
          void savePosition(userId, chapter.id, player.currentTime).catch(() => undefined);
        }
      } else {
        player.play();
        set({ isPlaying: true });
      }
    },

    seekTo: (seconds) => {
      if (player) void player.seekTo(Math.max(0, seconds));
    },

    skip: (seconds) => {
      if (player) void player.seekTo(Math.max(0, player.currentTime + seconds));
    },

    next: () => {
      void loadChapterAt(get().currentIndex + 1);
    },

    prev: () => {
      void loadChapterAt(get().currentIndex - 1);
    },

    stop: () => {
      if (player) {
        player.pause();
        player.clearLockScreenControls();
      }
      set({ isPlaying: false });
    },
  };
});

/** Libera a instância nativa (chamar ao desmontar o app, se necessário). */
export function releasePlayer() {
  statusSub?.remove();
  statusSub = null;
  player?.remove();
  player = null;
}
