import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { logger } from '@/core/logger';
import { supabase } from '@/core/supabase/client';
import { useAuth } from '@/providers/AuthProvider';

/**
 * Seleciona uma foto, redimensiona (256×256 JPEG), envia ao bucket `avatars`
 * e atualiza `users.avatar_url`. O upload é direto do cliente (mesma política
 * do web). Retorna `pick()` e o estado de envio.
 */
export function useAvatarUpload() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);

  async function pick(): Promise<void> {
    if (!user) return;

    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (result.canceled || !result.assets[0]) return;

    setUploading(true);
    try {
      // Redimensiona + comprime antes de subir.
      const processed = await manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 256, height: 256 } }],
        { compress: 0.85, format: SaveFormat.JPEG },
      );

      const arrayBuffer = await fetch(processed.uri).then((r) => r.arrayBuffer());
      const path = `${user.id}/avatar.jpg`;

      const { error: uploadErr } = await supabase.storage
        .from('avatars')
        .upload(path, arrayBuffer, { contentType: 'image/jpeg', upsert: true });
      if (uploadErr) throw uploadErr;

      const { data: pub } = supabase.storage.from('avatars').getPublicUrl(path);
      // Cache-bust pra forçar o reload da imagem nova (mesmo path, upsert).
      const avatarUrl = `${pub.publicUrl}?t=${Date.now()}`;

      const { error: updateErr } = await supabase
        .from('users')
        .update({ avatar_url: avatarUrl })
        .eq('id', user.id);
      if (updateErr) throw updateErr;

      await queryClient.invalidateQueries({ queryKey: ['profile', user.id] });
    } catch (e) {
      logger.error('[avatar] upload', e);
      throw e;
    } finally {
      setUploading(false);
    }
  }

  return { pick, uploading };
}
