import { useUpdateRoleMutation } from '@/queries/roles/roles.mutations';
import {
  type RoleDetailsSettingsFormSchema,
  roleDetailsSettingsFormSchema,
} from '@/schemas/role-details-settings-form.shema';
import { useForm } from '@tanstack/react-form';
import { useParams } from '@tanstack/react-router';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

interface RoleDetailsSettingsFormActionsProps {
  data: {
    name: string;
    description: string;
  };
}

const defaultValues: RoleDetailsSettingsFormSchema = {
  name: '',
  description: '',
};

const useRoleDetailsSettingsFormActions = ({
  data,
}: RoleDetailsSettingsFormActionsProps) => {
  const { roleId } = useParams({ from: '/dashboard/roles/$roleId' });
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
    defaultValues: data ?? defaultValues,
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
