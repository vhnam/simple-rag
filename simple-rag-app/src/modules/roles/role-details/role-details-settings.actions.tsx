import { useUpdateRoleMutation } from '@/queries/roles/roles.mutations';
import {
  type RoleSettingsFormSchema,
  roleSettingsFormSchema,
} from '@/schemas/role-form.schema';
import { useForm } from '@tanstack/react-form';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

interface RoleDetailsSettingsFormActionsProps {
  data: RoleSettingsFormSchema;
  roleId: string;
}

const useRoleDetailsSettingsFormActions = ({
  data,
  roleId,
}: RoleDetailsSettingsFormActionsProps) => {
  const { mutate: updateRole, isPending: isSubmitting } =
    useUpdateRoleMutation();

  const handleSubmit = ({ value }: { value: RoleSettingsFormSchema }) => {
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
      onSubmit: roleSettingsFormSchema,
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
