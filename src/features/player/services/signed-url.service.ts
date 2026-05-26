import { SIGNED_URL_REFRESH_MARGIN_MS, SIGNED_URL_TTL_MS } from '@/core/config/constants';
import { supabase } from '@/core/supabase/client';

interface CacheEntry {
  url: string;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();

/**
 * Obtém a URL assinada do áudio de um capítulo via edge function `signed-audio-url`.
 * Cacheia por capítulo e renova proativamente quando faltam < 10min para expirar
 * (URLs do R2 têm TTL de 1h e expirar durante a reprodução é o maior risco).
 */
export async function getSignedAudioUrl(chapterId: string): Promise<string> {
  const cached = cache.get(chapterId);
  if (cached && cached.expiresAt - Date.now() > SIGNED_URL_REFRESH_MARGIN_MS) {
    return cached.url;
  }

  const { data, error } = await supabase.functions.invoke('signed-audio-url', {
    body: { chapter_id: chapterId },
  });

  if (error) throw new Error(error.message ?? 'Falha ao obter o áudio.');

  const url = (data as { url?: string } | null)?.url;
  if (!url) throw new Error('URL de áudio não retornada pelo servidor.');

  cache.set(chapterId, { url, expiresAt: Date.now() + SIGNED_URL_TTL_MS });
  return url;
}
