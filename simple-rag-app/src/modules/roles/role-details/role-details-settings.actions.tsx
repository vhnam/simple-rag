import { useUpdateRoleMutation } from '@/queries/roles/roles.mutations';
import {
  type RoleDetailsSettingsFormSchema,
  roleDetailsSettingsFormSchema,
} from '@/schemas/role-details-form.shema';
import { useForm } from '@tanstack/react-form';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

interface RoleDetailsSettingsFormActionsProps {
  data: RoleDetailsSettingsFormSchema;
  roleId: string;
}

const useRoleDetailsSettingsFormActions = ({
  data,
  roleId,
}: RoleDetailsSettingsFormActionsProps) => {
  const { mutate: updateRole, isPending: isSubmitting } =
    useUpdateRoleMutation();

  const handleSubmit = ({
    value,
  }: {
    value: RoleDetailsSettingsFormSchema;
  }) => {
    updateRole(
      {
        id: roleId as string,
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
      onSubmit: roleDetailsSettingsFormSchema,
    },
    onSubmit: handleSubmit,
  });

  return {
    form,
    isSubmitting,
    onSubmit: handleSubmit,
  };
};

export default useRoleDetailsSettingsFormActions;
