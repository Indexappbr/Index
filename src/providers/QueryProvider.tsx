import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type PropsWithChildren, useState } from 'react';

/**
 * Provider do TanStack Query. staleTime de 60s como base (stale-while-revalidate);
 * refetchOnWindowFocus desligado (em mobile o foco é gerido por AppState — a
 * adicionar via focusManager na fase de feature parity).
 */
export function QueryProvider({ children }: PropsWithChildren) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            retry: 2,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
