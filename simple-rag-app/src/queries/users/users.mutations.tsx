import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateMyProfile } from './users.apis';
import { usersKeys } from './users.keys';
import type { UpdateProfileRequest } from './users.types';

export const useUpdateMyProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => updateMyProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.myProfile() });
    },
  });
};
