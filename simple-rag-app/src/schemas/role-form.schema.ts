import { z } from 'zod';

export const roleSettingsFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(255, 'Name must be at most 255 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description must be at most 500 characters'),
});

export const rolePermissionsFormSchema = z.object({
  permissionIds: z.array(z.uuid('Invalid permission ID format')),
});

export type RoleSettingsFormSchema = z.infer<typeof roleSettingsFormSchema>;
export type RolePermissionsFormSchema = z.infer<
  typeof rolePermissionsFormSchema
>;
