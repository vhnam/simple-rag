import { apiClient } from '@/lib/axios';
import {
  CreateRoleRequest,
  Role,
  RolesRequest,
  RolesResponse,
  RoleUsersRequest,
  RoleUsersResponse,
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

export const createRole = async ({ data }: CreateRoleRequest) => {
  const response = await apiClient.post<Role>(`/roles`, data);
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

export const getRoleUsers = async ({ roleId, ...params }: RoleUsersRequest) => {
  const response = await apiClient.get<RoleUsersResponse>(
    `/roles/${roleId}/users`,
    {
      params,
    }
  );
  return response.data;
};

export const removeUserFromRole = async (roleId: string, userId: string) => {
  const response = await apiClient.delete<Role>(
    `/roles/${roleId}/remove-user/${userId}`
  );
  return response.data;
};
