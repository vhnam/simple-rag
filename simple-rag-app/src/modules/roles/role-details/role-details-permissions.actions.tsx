import { useUpdateRoleMutation } from '@/queries/roles/roles.mutations';
import { RolePermission } from '@/queries/roles/roles.types';
import {
  roleDetailsPermissionsFormSchema,
  type RoleDetailsPermissionsFormSchema,
} from '@/schemas/role-details-form.shema';
import { useForm } from '@tanstack/react-form';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

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

  const handleSubmit = ({
    value,
  }: {
    value: RoleDetailsPermissionsFormSchema;
  }) => {
    updateRole(
      { id: roleId as string, data: value },
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
      onSubmit: roleDetailsPermissionsFormSchema,
    },
    onSubmit: handleSubmit,
  });

  return {
    form,
    isSubmitting,
    onSubmit: handleSubmit,
  };
};
