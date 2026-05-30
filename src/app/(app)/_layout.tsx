import { Stack } from 'expo-router';

import { useFavoritesSync } from '@/features/favorites/hooks/use-favorites-sync';
import { useNotificationRouter } from '@/features/notifications/hooks/use-notification-router';
import { configureNotificationHandler } from '@/features/notifications/service';

// Configura a exibição de notificações em primeiro plano (uma vez, no load).
configureNotificationHandler();

/**
 * Área autenticada: Stack que empilha telas de detalhe (ex: livro/[id]) por
 * cima do grupo de tabs. As tabs vivem em (tabs)/ com seu próprio layout.
 */
export default function AppLayout() {
  // Faz o merge dos favoritos com o servidor uma vez por sessão autenticada.
  useFavoritesSync();
  // Toque numa notificação navega pro destino do payload (ex: um livro).
  useNotificationRouter();

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="livro/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="notificacoes" options={{ headerShown: true, title: 'Notificações' }} />
    </Stack>
  );
}
