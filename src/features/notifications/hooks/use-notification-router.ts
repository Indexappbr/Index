import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect } from 'react';

import { routeFromNotification } from '../service';

/**
 * Trata o toque numa notificação: navega pro destino do payload (ex: um livro).
 * Cobre tanto o app aberto quanto o caso de ter sido aberto pela notificação.
 * Montar uma vez na área autenticada.
 */
export function useNotificationRouter() {
  useEffect(() => {
    // App aberto a partir de uma notificação (cold start).
    let handled = false;
    void Notifications.getLastNotificationResponseAsync().then((response) => {
      if (handled || !response) return;
      const path = routeFromNotification(response.notification.request.content.data);
      if (path) router.push(path as never);
    });

    // App já aberto: usuário toca numa notificação.
    const sub = Notifications.addNotificationResponseReceivedListener((response) => {
      handled = true;
      const path = routeFromNotification(response.notification.request.content.data);
      if (path) router.push(path as never);
    });

    return () => sub.remove();
  }, []);
}
