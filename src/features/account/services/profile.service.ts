import { supabase } from '@/core/supabase/client';

import type { Profile } from '../types';

/** Lê o perfil do usuário a partir da tabela `users`. */
export async function fetchProfile(userId: string): Promise<Profile> {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, full_name, display_name, avatar_url, is_founder, founder_number, twofa_enabled')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return {
    id: data.id,
    email: data.email,
    fullName: data.full_name,
    displayName: data.display_name,
    avatarUrl: data.avatar_url,
    isFounder: data.is_founder,
    founderNumber: data.founder_number,
    twofaEnabled: data.twofa_enabled ?? false,
  };
}

/** Atualiza nome completo e/ou nome de exibição. */
export async function updateProfile(
  userId: string,
  patch: { fullName?: string; displayName?: string },
): Promise<void> {
  const { error } = await supabase
    .from('users')
    .update({ full_name: patch.fullName, display_name: patch.displayName })
    .eq('id', userId);

  if (error) throw error;
}
