import { z } from 'zod';

export const getRoleSchema = z.object({
  id: z.uuid({ message: 'Invalid role ID format' }),
});

export type GetRoleDto = z.infer<typeof getRoleSchema>;
