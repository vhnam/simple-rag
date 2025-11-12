import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router';
import { Toaster } from 'sonner';
import type { PropsWithChildren } from 'react';
import type { QueryClient } from '@tanstack/react-query';
import appCss from '@/styles.css?url';
import { Layout } from '@/layouts';
import { NotFound } from '@/components/not-found';

import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

interface RootContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RootContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: import.meta.env.VITE_APP_TITLE,
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
});

function RootDocument({ children }: PropsWithChildren) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
        <Layout>{children}</Layout>

        <Toaster />
        <Scripts />
      </body>
    </html>
  );
}
