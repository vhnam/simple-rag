import { useMutation } from '@tanstack/react-query';
import { updateRole } from './roles.apis';
import { type UpdateRoleRequest } from './roles.types';

export const useUpdateRoleMutation = () => {
  return useMutation({
    mutationFn: (payload: UpdateRoleRequest) => updateRole(payload),
  });
};
