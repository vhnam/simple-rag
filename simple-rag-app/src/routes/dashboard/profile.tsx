import { Profile } from '@/modules/profile/profile';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/profile')({
  component: Profile,
});
