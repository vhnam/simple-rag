import { createFileRoute } from '@tanstack/react-router';
import { RolesList } from '@/modules/roles/roles-list';

export const Route = createFileRoute('/dashboard/roles/')({
  component: RolesList,
});
