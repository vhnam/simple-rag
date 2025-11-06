import { useMutation } from '@tanstack/react-query';
import { syncUser } from './auth.apis';

export const useSyncUserMutation = () => {
  return useMutation({
    mutationFn: syncUser,
  });
};
