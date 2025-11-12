import { useForm } from '@tanstack/react-form';

import { AxiosError } from 'axios';
import { toast } from 'sonner';

import type { RolePermissionsFormSchema } from '@/schemas/role-form.schema';
import { rolePermissionsFormSchema } from '@/schemas/role-form.schema';

import { useUpdateRoleMutation } from '@/queries/roles/roles.mutations';
import type { RolePermission } from '@/queries/roles/roles.types';

interface RoleDetailsPermissionsFormActionsProps {
  data: Array<RolePermission>;
  roleId: string;
}

export const useRoleDetailsPermissionsFormActions = ({
  data,
  roleId,
}: RoleDetailsPermissionsFormActionsProps) => {
  const { mutate: updateRole, isPending: isSubmitting } =
    useUpdateRoleMutation();

  const handleSubmit = ({ value }: { value: RolePermissionsFormSchema }) => {
    updateRole(
      { id: roleId, data: value },
      {
        onSuccess: () => {
          toast.success('Permissions updated successfully');
        },
        onError: (error) => {
          if (error instanceof AxiosError) {
            toast.error(error.response?.data.error?.message);
          } else {
            toast.error('Failed to update permissions');
          }
        },
      }
    );
  };

  const form = useForm({
    defaultValues: {
      permissionIds: data.map((permission) => permission.permission.id),
    },
    validators: {
      onSubmit: rolePermissionsFormSchema,
    },
    onSubmit: handleSubmit,
  });

  return {
    form,
    isSubmitting,
    onSubmit: handleSubmit,
  };
};
