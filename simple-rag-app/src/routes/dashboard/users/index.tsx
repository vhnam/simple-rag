import { createFileRoute } from '@tanstack/react-router';

import { Users } from '@/modules/users';

export const Route = createFileRoute('/dashboard/users/')({
  component: Users,
});
