import { z } from 'zod';

export const deleteRoleSchema = z.object({
  id: z.string().uuid({ message: 'Invalid role ID format' }),
});

export type DeleteRoleDto = z.infer<typeof deleteRoleSchema>;
