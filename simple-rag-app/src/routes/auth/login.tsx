import { useEffect } from 'react';

import { createFileRoute, useNavigate } from '@tanstack/react-router';

import { useAuthContext } from '@/integrations/auth/auth-provider';

export const Route = createFileRoute('/auth/login')({
  component: LoginPage,
});

function LoginPage() {
  const { login, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: '/' });
    } else {
      login();
    }
  }, [isAuthenticated, login, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground">Redirecting to login...</p>
      </div>
    </div>
  );
}
