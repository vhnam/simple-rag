import { routeTree } from '@/routeTree.gen';

import { createRouter } from '@tanstack/react-router';
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query';

import { AuthWrapper } from '@/integrations/auth/auth-provider';
import { QueryProvider, getContext } from '@/integrations/tanstack-query';

export const getRouter = () => {
  const rqContext = getContext();

  const router = createRouter({
    routeTree,
    context: { ...rqContext },
    defaultPreload: 'intent',
    Wrap: (props: { children: React.ReactNode }) => {
      return (
        <AuthWrapper>
          <QueryProvider {...rqContext}>{props.children}</QueryProvider>
        </AuthWrapper>
      );
    },
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient: rqContext.queryClient,
  });

  return router;
};
