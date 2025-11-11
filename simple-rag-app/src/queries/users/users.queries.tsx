import { useQuery } from '@tanstack/react-query';
import { UsersRequest } from './users.types';
import { usersKeys } from './users.keys';
import { getMyProfile, getUsers } from './users.apis';

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
