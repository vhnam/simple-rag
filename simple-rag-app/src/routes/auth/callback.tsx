import { Spinner } from '@/components/ui/spinner';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/auth/callback')({
  component: CallbackPage,
});

function CallbackPage() {
  return (
    <div className="flex min-h-[calc(100vh-16rem)] items-center justify-center">
      <Spinner className="size-24" />
    </div>
  );
}
