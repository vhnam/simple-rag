import { useAuthStore } from '@/stores/auth.store';

export const usePermissions = () => {
  const { permissions, role } = useAuthStore();

  const hasPermission = (key: string) => permissions.includes(key);
  const hasAny = (keys: string[]) =>
    keys.some((key) => permissions.includes(key));
  const hasRole = (role: string) => role.includes(role);

  return {
    permissions,
    role,
    hasPermission,
    hasAny,
    hasRole,
  };
};
