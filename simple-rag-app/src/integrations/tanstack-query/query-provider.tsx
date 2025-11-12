import type { PropsWithChildren } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface ReactQueryContext extends PropsWithChildren {
  queryClient: QueryClient;
}

export const getContext = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 3,
      },
    },
  });
  return {
    queryClient,
  };
};

export const QueryProvider = ({ children, queryClient }: ReactQueryContext) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
