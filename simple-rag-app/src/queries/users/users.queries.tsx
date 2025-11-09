import { useQuery } from '@tanstack/react-query';
import { UsersRequest } from './users.types';
import { usersKeys } from './users.keys';
import { getUsers } from './users.apis';

const useUsers = (
  request: UsersRequest = { page: 1, limit: 10 },
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: usersKeys.list(request.page, request.limit, request.search),
    queryFn: () => getUsers(request),
    enabled: options?.enabled ?? true,
  });
};

export default useUsers;
