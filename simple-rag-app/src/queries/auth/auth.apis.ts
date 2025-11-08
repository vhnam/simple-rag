import { apiClient } from '@/lib/axios';
import type { SyncUserRequest, SyncUserResponse } from './auth.types';

export const syncUser = async ({
  accessToken,
  ...payload
}: SyncUserRequest) => {
  // Note: Authorization header is automatically added by axios interceptor
  // The accessToken parameter is kept for backward compatibility but not used here
  const response = await apiClient.post<SyncUserResponse>(
    '/auth/sync',
    payload
  );
  return response.data;
};
