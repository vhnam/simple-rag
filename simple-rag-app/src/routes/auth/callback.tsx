import { Spinner } from '@/components/ui/spinner';
import { useAuthContext } from '@/integrations/auth/auth-provider';
import { useSyncUserMutation } from '@/queries/auth';
import { SyncUserRequest } from '@/queries/auth/auth.typings';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import isEmail from 'validator/lib/isEmail';

export const Route = createFileRoute('/auth/callback')({
  component: CallbackPage,
});

function CallbackPage() {
  const { getAccessTokenSilently, user } = useAuthContext();
  const { mutateAsync: syncUser } = useSyncUserMutation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleSyncUser = async () => {
      const token = await getAccessTokenSilently();
      if (user) {
        const payload: SyncUserRequest = {
          sub: user.sub!,
          email: user.email!,
          name:
            (user.name && !isEmail(user.name) ? user.name : user.nickname) ??
            user.nickname ??
            'Unknown User',
          picture: user.picture ?? null,
          accessToken: token,
        };
        const response = await syncUser(payload);

        if (response.role.includes('admin')) {
          navigate({ to: '/dashboard' });
        } else {
          navigate({ to: '/' });
        }
      }
    };

    handleSyncUser();
  }, [getAccessTokenSilently, user]);

  return (
    <div className="flex min-h-[calc(100vh-16rem)] items-center justify-center">
      <Spinner className="size-24" />
    </div>
  );
}
