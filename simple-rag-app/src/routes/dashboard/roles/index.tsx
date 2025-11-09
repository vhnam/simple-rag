import { RolesList } from '@/modules/roles/roles-list';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/roles/')({
  component: RolesList,
});
