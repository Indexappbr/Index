import { supabase } from '@/core/supabase/client';

/** Posição salva (em segundos) do usuário num capítulo. 0 se não houver. */
export async function loadPosition(userId: string, chapterId: string): Promise<number> {
  const { data } = await supabase
    .from('playback_positions')
    .select('position_seconds')
    .eq('user_id', userId)
    .eq('chapter_id', chapterId)
    .maybeSingle();

  return data?.position_seconds ?? 0;
}

/** Salva/atualiza a posição de reprodução (chamado a cada ~30s e ao pausar). */
export async function savePosition(
  userId: string,
  chapterId: string,
  positionSeconds: number,
): Promise<void> {
  const { error } = await supabase.from('playback_positions').upsert(
    {
      user_id: userId,
      chapter_id: chapterId,
      position_seconds: Math.floor(positionSeconds),
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,chapter_id' },
  );
  if (error) throw error;
}
