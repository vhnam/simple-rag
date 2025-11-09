import { useQuery } from '@tanstack/react-query';
import { RolesRequest } from './roles.types';
import { rolesKeys } from './roles.keys';
import { getRole, getRoles } from './roles.apis';

export const useRoles = (request: RolesRequest = { page: 1, limit: 10 }) => {
  return useQuery({
    queryKey: rolesKeys.list(request.page, request.limit, request.search),
    queryFn: () => getRoles(request),
  });
};

export const useRole = (id: string) => {
  return useQuery({
    queryKey: rolesKeys.detail(id),
    queryFn: () => getRole(id),
  });
};
