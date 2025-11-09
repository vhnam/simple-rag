import { apiClient } from '@/lib/axios';
import {
  Role,
  RolesRequest,
  RolesResponse,
  UpdateRoleRequest,
} from './roles.types';

export const getRoles = async (request: RolesRequest) => {
  const response = await apiClient.get<RolesResponse>('/roles', {
    params: request,
  });
  return response.data;
};

export const getRole = async (id: string) => {
  const response = await apiClient.get<Role>(`/roles/${id}`);
  return response.data;
};

export const updateRole = async ({ id, data }: UpdateRoleRequest) => {
  const response = await apiClient.put<Role>(`/roles/${id}`, data);
  return response.data;
};

export const deleteRole = async (id: string) => {
  const response = await apiClient.delete<Role>(`/roles/${id}`);
  return response.data;
};
