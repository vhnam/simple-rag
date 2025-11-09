import { z } from 'zod';

export const roleDetailsSettingsFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(255, 'Name must be at most 255 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description must be at most 500 characters'),
});

export const roleDetailsPermissionsFormSchema = z.object({
  permissionIds: z.array(z.uuid('Invalid permission ID format')),
});

export type RoleDetailsSettingsFormSchema = z.infer<
  typeof roleDetailsSettingsFormSchema
>;
export type RoleDetailsPermissionsFormSchema = z.infer<
  typeof roleDetailsPermissionsFormSchema
>;
