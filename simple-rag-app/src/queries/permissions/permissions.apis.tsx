import { apiClient } from '@/lib/axios';

import type { PermissionsResponse } from './permissions.types';

export const getPermissions = async () => {
  const response = await apiClient.get<PermissionsResponse>('/permissions');
  return response.data;
};
