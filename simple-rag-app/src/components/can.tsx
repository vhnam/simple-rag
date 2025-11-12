import type { PropsWithChildren, ReactNode } from 'react';
import { usePermissions } from '@/hooks/user-permissions';

interface CanProps extends PropsWithChildren {
  permission?: string;
  role?: string;
  fallback?: ReactNode;
}

export const Can = ({
  permission,
  role,
  children,
  fallback = null,
}: CanProps) => {
  const { hasPermission, hasRole } = usePermissions();

  const allowed =
    (permission && hasPermission(permission)) || (role && hasRole(role));

  if (!allowed) return fallback;

  return children;
};
