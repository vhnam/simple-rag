import { useForm } from '@tanstack/react-form';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { useEffect } from 'react';
import type { ProfileFormSchema } from '@/schemas/profile-form.schema';
import type { ProfileResponse } from '@/queries/users/users.types';
import { profileFormSchema } from '@/schemas/profile-form.schema';
import { useUpdateMyProfile } from '@/queries/users';

interface ProfileActionsProps {
  data?: ProfileResponse;
}

const useProfileActions = ({ data }: ProfileActionsProps) => {
  const { mutate: updateProfile, isPending: isSubmitting } =
    useUpdateMyProfile();

  const handleSubmit = ({ value }: { value: ProfileFormSchema }) => {
    updateProfile(value, {
      onSuccess: () => {
        toast.success('Profile updated successfully');
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data.error?.message);
        } else {
          toast.error('Failed to update profile');
        }
      },
    });
  };

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      interface_theme: 'system',
      interface_language: 'en-US',
      ai_language: 'en-US',
    },
    validators: { onSubmit: profileFormSchema },
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    if (data?.user) {
      form.reset({
        name: data.user.name,
        email: data.user.email,
        interface_theme: data.preferences?.interface_theme ?? 'system',
        interface_language: data.preferences?.interface_language ?? 'en-US',
        ai_language: data.preferences?.ai_language ?? 'en-US',
      });
    }
  }, [data]);

  return {
    form,
    isSubmitting,
  };
};

export default useProfileActions;
