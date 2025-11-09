import { z } from 'zod';

export const removeUserFromRoleParamsSchema = z.object({
  roleId: z.uuid({ message: 'Invalid role ID format' }),
  userId: z.uuid({ message: 'Invalid user ID format' }),
});

export type RemoveUserFromRoleParamsDto = z.infer<
  typeof removeUserFromRoleParamsSchema
>;
