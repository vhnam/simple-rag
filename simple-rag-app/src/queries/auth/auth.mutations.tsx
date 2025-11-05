import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios';
import type { SyncUserRequest, SyncUserResponse } from './auth.typings';

export const useSyncUserMutation = () => {
  return useMutation({
    mutationFn: async ({ accessToken, ...payload }: SyncUserRequest) => {
      const response = await apiClient.post<SyncUserResponse>(
        '/auth/sync',
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    },
  });
};
