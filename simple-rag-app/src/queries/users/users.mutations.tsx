import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdateProfileRequest } from './users.types';
import { updateMyProfile } from './users.apis';
import { usersKeys } from './users.keys';

export const useUpdateMyProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => updateMyProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.myProfile() });
    },
  });
};
