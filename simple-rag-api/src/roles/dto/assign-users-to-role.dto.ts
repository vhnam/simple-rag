import { z } from 'zod';

export const assignUsersToRoleBodySchema = z.object({
  userIds: z
    .array(z.uuid({ message: 'Invalid user ID format' }))
    .min(1, { message: 'At least one user is required' }),
});

export type AssignUsersToRoleBodyDto = z.infer<
  typeof assignUsersToRoleBodySchema
>;
