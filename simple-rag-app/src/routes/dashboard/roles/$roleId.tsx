import { createFileRoute } from '@tanstack/react-router';

import { RoleDetails } from '@/modules/roles/role-details';

export const Route = createFileRoute('/dashboard/roles/$roleId')({
  component: RoleDetails,
});
