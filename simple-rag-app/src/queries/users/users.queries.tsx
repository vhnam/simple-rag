import { useQuery } from '@tanstack/react-query';
import { UsersRequest } from './users.typings';
import { usersKeys } from './users.keys';
import { getUsers } from './users.apis';

const useUsers = (request: UsersRequest = { page: 1, limit: 10 }) => {
  return useQuery({
    queryKey: usersKeys.list(request.page, request.limit, request.search),
    queryFn: () => getUsers(request),
  });
};

export default useUsers;
