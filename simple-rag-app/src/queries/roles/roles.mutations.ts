import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteRole, removeUserFromRole, updateRole } from './roles.apis';
import type {
  RemoveUserFromRoleRequest,
  UpdateRoleRequest,
} from './roles.types';
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

export const useRemoveUserFromRoleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ roleId, userId }: RemoveUserFromRoleRequest) =>
      removeUserFromRole(roleId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rolesKeys.all });
    },
  });
};
