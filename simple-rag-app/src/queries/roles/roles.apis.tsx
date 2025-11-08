import { apiClient } from '@/lib/axios';
import { RolesRequest, RolesResponse } from './roles.types';

export const getRoles = async (request: RolesRequest) => {
  const response = await apiClient.get<RolesResponse>('/roles', {
    params: request,
  });
  return response.data;
};
