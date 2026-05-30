import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { initSentry, wrapWithSentry } from '@/core/observability/sentry';
import { AuthProvider, useAuth } from '@/providers/AuthProvider';
import { QueryProvider } from '@/providers/QueryProvider';

// Observabilidade: inicializa cedo (no-op se não houver DSN configurado).
initSentry();

/**
 * Navegação raiz com guarda de sessão. `Stack.Protected` (Expo Router v6)
 * só monta o grupo cujo `guard` é verdadeiro e redireciona automaticamente
 * quando a sessão muda — sem precisar de useEffect + router.replace manual.
 */
function RootNavigator() {
  const { session, isLoading } = useAuth();

  // Enquanto resolve a sessão inicial, o AnimatedSplashOverlay cobre a tela.
  if (isLoading) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
      <Stack.Protected guard={!session}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
    </Stack>
  );
}

function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <QueryProvider>
      <AuthProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <AnimatedSplashOverlay />
          <RootNavigator />
        </ThemeProvider>
      </AuthProvider>
    </QueryProvider>
  );
}

export default wrapWithSentry(RootLayout);
