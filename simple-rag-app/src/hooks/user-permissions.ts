import { useAuthStore } from '@/stores/auth.store';

export const usePermissions = () => {
  const { permissions, role } = useAuthStore();

  const hasPermission = (key: string) => permissions.includes(key);
  const hasAny = (keys: Array<string>) =>
    keys.some((key) => permissions.includes(key));
  const hasRole = (roleName: string) => role.includes(roleName);

  return {
    permissions,
    role,
    hasPermission,
    hasAny,
    hasRole,
  };
};
