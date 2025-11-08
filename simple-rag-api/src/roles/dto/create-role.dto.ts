import { z } from 'zod';

export const createRoleSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Role name is required' })
    .max(255, { message: 'Role name must be at most 255 characters' }),
  description: z
    .string()
    .max(500, { message: 'Description must be at most 500 characters' })
    .optional(),
  permissionIds: z
    .array(z.string().uuid({ message: 'Invalid permission ID format' }))
    .min(1, { message: 'At least one permission is required' }),
});

export type CreateRoleDto = z.infer<typeof createRoleSchema>;
