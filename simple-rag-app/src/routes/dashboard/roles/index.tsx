import { Roles } from '@/modules/roles';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/roles/')({
  component: Roles,
});
