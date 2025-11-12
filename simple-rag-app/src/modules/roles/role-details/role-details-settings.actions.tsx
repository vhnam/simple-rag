import { useForm } from '@tanstack/react-form';
import { useNavigate } from '@tanstack/react-router';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import type {RoleSettingsFormSchema} from '@/schemas/role-form.schema';
import {
  
  roleSettingsFormSchema
} from '@/schemas/role-form.schema';
import {
  useDeleteRoleMutation,
  useUpdateRoleMutation,
} from '@/queries/roles/roles.mutations';

interface RoleDetailsSettingsFormActionsProps {
  data: RoleSettingsFormSchema;
  roleId: string;
}

const useRoleDetailsSettingsFormActions = ({
  data,
  roleId,
}: RoleDetailsSettingsFormActionsProps) => {
  const navigate = useNavigate();
  const { mutate: updateRole, isPending: isUpdating } = useUpdateRoleMutation();
  const { mutate: deleteRole, isPending: isDeleting } = useDeleteRoleMutation();

  const handleDelete = (roleId: string) => {
    deleteRole(roleId, {
      onSuccess: () => {
        toast.success('Role deleted successfully');
        navigate({ to: '/dashboard/roles', replace: true });
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data.error?.message);
        } else {
          toast.error('Failed to delete role');
        }
      },
    });
  };

  const handleSubmit = ({ value }: { value: RoleSettingsFormSchema }) => {
    updateRole(
      {
        id: roleId,
        data: {
          name: value.name,
          description: value.description,
        },
      },
      {
        onSuccess: () => {
          toast.success('Role updated successfully');
        },
        onError: (error) => {
          if (error instanceof AxiosError) {
            toast.error(error.response?.data.error?.message);
          } else {
            toast.error('Failed to update role');
          }
        },
      }
    );
  };

  const form = useForm({
    defaultValues: data,
    validators: {
      onSubmit: roleSettingsFormSchema,
    },
    onSubmit: handleSubmit,
  });

  return {
    form,
    isSubmitting: isUpdating || isDeleting,
    onSubmit: handleSubmit,
    onDelete: handleDelete,
  };
};

export default useRoleDetailsSettingsFormActions;
