import { Stack } from 'expo-router';

/**
 * Área autenticada: Stack que empilha telas de detalhe (ex: livro/[id]) por
 * cima do grupo de tabs. As tabs vivem em (tabs)/ com seu próprio layout.
 */
export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="livro/[id]" options={{ headerShown: false }} />
    </Stack>
  );
}
