import { useQuery } from '@tanstack/react-query';

import { getMyProfile, getUsers } from './users.apis';
import { usersKeys } from './users.keys';
import type { UsersRequest } from './users.types';

export const useUsers = (
  request: UsersRequest = { page: 1, limit: 10 },
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: usersKeys.list(request.page, request.limit, request.search),
    queryFn: () => getUsers(request),
    enabled: options?.enabled ?? true,
  });
};

export const useMyProfile = () => {
  return useQuery({
    queryKey: usersKeys.myProfile(),
    queryFn: getMyProfile,
  });
};
