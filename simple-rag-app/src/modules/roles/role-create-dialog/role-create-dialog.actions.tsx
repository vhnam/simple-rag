import { useCreateRoleMutation } from '@/queries/roles/roles.mutations';
import {
  RoleSettingsFormSchema,
  roleSettingsFormSchema,
} from '@/schemas/role-form.schema';
import { useForm } from '@tanstack/react-form';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

interface UseRoleCreateDialogActionsProps {
  onSuccess?: () => void;
}

const useRoleCreateDialogActions = ({
  onSuccess,
}: UseRoleCreateDialogActionsProps = {}) => {
  const { mutate: createRole, isPending: isSubmitting } =
    useCreateRoleMutation();

  const handleSubmit = ({ value }: { value: RoleSettingsFormSchema }) => {
    createRole(
      { data: value },
      {
        onSuccess: () => {
          toast.success('Role created successfully');
          form.reset();
          onSuccess?.();
        },
        onError: (error) => {
          if (error instanceof AxiosError) {
            toast.error(error.response?.data.error?.message);
          } else {
            toast.error('Failed to create role');
          }
        },
      }
    );
  };

  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
    },
    validators: {
      onSubmit: roleSettingsFormSchema,
    },
    onSubmit: handleSubmit,
  });

  return {
    form,
    isSubmitting,
  };
};

export default useRoleCreateDialogActions;
