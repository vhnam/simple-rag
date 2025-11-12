import { createFileRoute } from '@tanstack/react-router';

import { Profile } from '@/modules/profile/profile';

export const Route = createFileRoute('/dashboard/profile')({
  component: Profile,
});
