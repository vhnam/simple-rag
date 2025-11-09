import { useQuery } from '@tanstack/react-query';
import { permissionsKeys } from './permissions.keys';
import { getPermissions } from './permissions.apis';

export const usePermissions = () => {
  return useQuery({
    queryKey: permissionsKeys.list(),
    queryFn: getPermissions,
  });
};
