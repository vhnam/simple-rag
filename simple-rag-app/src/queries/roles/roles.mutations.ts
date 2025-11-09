import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteRole, updateRole } from './roles.apis';
import { type UpdateRoleRequest } from './roles.types';
import { rolesKeys } from './roles.keys';

export const useUpdateRoleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateRoleRequest) => updateRole(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rolesKeys.all });
    },
  });
};

export const useDeleteRoleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rolesKeys.all });
    },
  });
};
