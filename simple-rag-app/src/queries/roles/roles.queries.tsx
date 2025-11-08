import { useQuery } from '@tanstack/react-query';
import { RolesRequest } from './roles.types';
import { rolesKeys } from './roles.keys';
import { getRoles } from './roles.apis';

const useRoles = (request: RolesRequest = { page: 1, limit: 10 }) => {
  return useQuery({
    queryKey: rolesKeys.list(request.page, request.limit, request.search),
    queryFn: () => getRoles(request),
  });
};

export default useRoles;
