import { AxiosError } from 'axios';
import { toast } from 'sonner';
import {
  useAssignUsersToRoleMutation,
  useRemoveUserFromRoleMutation,
} from '@/queries/roles';

export const useRoleDetailsUsersActions = () => {
  const { mutate: removeUserFromRole, isPending: isRemovingUser } =
    useRemoveUserFromRoleMutation();
  const { mutate: assignUsers, isPending: isAssigningUsers } =
    useAssignUsersToRoleMutation();

  const handleRemoveUserFromRole = (roleId: string, userId: string) => {
    removeUserFromRole(
      { roleId, userId },
      {
        onSuccess: () => {
          toast.success('User removed from role successfully');
        },
        onError: (error) => {
          if (error instanceof AxiosError) {
            toast.error(error.response?.data?.message);
          } else {
            toast.error('Failed to remove user from role');
          }
        },
      }
    );
  };

  const handleAssignUsers = (roleId: string, userIds: Array<string>) => {
    assignUsers(
      { roleId, userIds },
      {
        onSuccess: () => {
          toast.success('Users assigned to role successfully');
        },
        onError: (error) => {
          if (error instanceof AxiosError) {
            toast.error(error.response?.data?.message);
          } else {
            toast.error('Failed to assign users to role');
          }
        },
      }
    );
  };

  return {
    isAssigningUsers,
    isRemovingUser,
    onAssignUsers: handleAssignUsers,
    onRemoveUserFromRole: handleRemoveUserFromRole,
  };
};
