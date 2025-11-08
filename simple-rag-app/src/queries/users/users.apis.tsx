import { apiClient } from '@/lib/axios';
import { UsersRequest, UsersResponse } from './users.typings';

export const getUsers = async (request: UsersRequest) => {
  const response = await apiClient.get<UsersResponse>('/users', {
    params: request,
  });
  return response.data;
};
