import { useQuery } from '@tanstack/react-query';

import { getPermissions } from './permissions.apis';
import { permissionsKeys } from './permissions.keys';

export const usePermissions = () => {
  return useQuery({
    queryKey: permissionsKeys.list(),
    queryFn: getPermissions,
  });
};
