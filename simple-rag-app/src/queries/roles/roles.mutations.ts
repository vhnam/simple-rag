import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  assignUsersToRole,
  createRole,
  deleteRole,
  removeUserFromRole,
  updateRole,
} from './roles.apis';
import { rolesKeys } from './roles.keys';
import type {
  AssignUsersToRoleRequest,
  CreateRoleRequest,
  RemoveUserFromRoleRequest,
  UpdateRoleRequest,
} from './roles.types';

export const useCreateRoleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateRoleRequest) => createRole(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rolesKeys.all });
    },
  });
};

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

export const useAssignUsersToRoleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ roleId, userIds }: AssignUsersToRoleRequest) =>
      assignUsersToRole(roleId, userIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rolesKeys.all });
    },
  });
};
