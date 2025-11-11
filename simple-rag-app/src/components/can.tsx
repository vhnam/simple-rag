import { usePermissions } from '@/hooks/user-permissions';
import type { ReactNode, PropsWithChildren } from 'react';

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
