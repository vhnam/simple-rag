import type { PermissionsResponse } from './permissions.types';
import { apiClient } from '@/lib/axios';

export const getPermissions = async () => {
  const response = await apiClient.get<PermissionsResponse>('/permissions');
  return response.data;
};
