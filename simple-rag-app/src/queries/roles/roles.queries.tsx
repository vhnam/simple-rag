import { useQuery } from '@tanstack/react-query';

import { getRole, getRoleUsers, getRoles } from './roles.apis';
import { rolesKeys } from './roles.keys';
import type { RoleUsersRequest, RolesRequest } from './roles.types';

export const useRoles = (request: RolesRequest = { page: 1, limit: 10 }) => {
  return useQuery({
    queryKey: rolesKeys.list(request.page, request.limit, request.search),
    queryFn: () => getRoles(request),
  });
};

export const useRole = (id: string) => {
  return useQuery({
    queryKey: rolesKeys.details(id),
    queryFn: () => getRole(id),
  });
};

export const useRoleUsers = ({ roleId, ...params }: RoleUsersRequest) => {
  return useQuery({
    queryKey: rolesKeys.roleUsers(roleId),
    queryFn: () => getRoleUsers({ roleId, ...params }),
  });
};
