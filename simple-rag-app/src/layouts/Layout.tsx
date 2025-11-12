import type { PropsWithChildren } from 'react';

import { useAuthContext } from '@/integrations/auth/auth-provider';

import { useAuthStore } from '@/stores/auth.store';

import { Spinner } from '@/components/ui/spinner';

import { ProtectedLayout } from './protected-layout';
import { PublicLayout } from './public-layout';

const Layout = ({ children }: PropsWithChildren) => {
  const { isAuthenticated, isLoading } = useAuthContext();
  const { role } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner className="size-24" />
      </div>
    );
  }

  // return isAuthenticated && role.includes('admin') ? (
  return isAuthenticated ? (
    <ProtectedLayout>{children}</ProtectedLayout>
  ) : (
    <PublicLayout>{children}</PublicLayout>
  );
};

export default Layout;
