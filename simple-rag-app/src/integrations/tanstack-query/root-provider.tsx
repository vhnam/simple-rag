import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';

interface ReactQueryContext extends PropsWithChildren {
  queryClient: QueryClient;
}

export function getContext() {
  const queryClient = new QueryClient();
  return {
    queryClient,
  };
}

export function Provider({ children, queryClient }: ReactQueryContext) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
