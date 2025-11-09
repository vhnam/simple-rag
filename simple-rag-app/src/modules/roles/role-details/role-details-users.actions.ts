import { useRemoveUserFromRoleMutation } from '@/queries/roles';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

export const useRoleDetailsUsersActions = () => {
  const { mutate: removeUserFromRole, isPending: isRemovingUser } =
    useRemoveUserFromRoleMutation();

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

  return {
    isRemovingUser,
    onRemoveUserFromRole: handleRemoveUserFromRole,
  };
};
