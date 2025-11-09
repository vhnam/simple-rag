import { z } from 'zod';

export const getUsersByRoleQuerySchema = z.object({
  roleId: z.uuid({ message: 'Invalid role ID format' }),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type GetUsersByRoleQueryDto = z.infer<typeof getUsersByRoleQuerySchema>;
