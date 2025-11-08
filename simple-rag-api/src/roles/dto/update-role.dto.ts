import { z } from 'zod';

export const updateRoleSchema = z.object({
  id: z.string().uuid({ message: 'Invalid role ID format' }),
  name: z
    .string()
    .min(1, { message: 'Role name cannot be empty' })
    .max(255, { message: 'Role name must be at most 255 characters' })
    .optional(),
  description: z
    .string()
    .max(500, { message: 'Description must be at most 500 characters' })
    .optional(),
  permissionIds: z
    .array(z.string().uuid({ message: 'Invalid permission ID format' }))
    .min(1, { message: 'At least one permission is required' })
    .optional(),
});

export type UpdateRoleDto = z.infer<typeof updateRoleSchema>;
