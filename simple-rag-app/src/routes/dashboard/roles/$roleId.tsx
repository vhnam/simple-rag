import { RoleDetails } from '@/modules/roles/role-details';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/roles/$roleId')({
  component: RoleDetails,
});
