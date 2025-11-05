import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useAuth0Context } from '@/integrations/auth0/auth-provider';

export const Route = createFileRoute('/auth/register')({
  component: RegisterPage,
});

function RegisterPage() {
  const { login, isAuthenticated } = useAuth0Context();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: '/' });
    } else {
      // Use screen_hint to show the signup form in Auth0
      login({ screen_hint: 'signup' });
    }
  }, [isAuthenticated, login, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-muted-foreground">Redirecting to sign up...</p>
      </div>
    </div>
  );
}
