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

export type RoleDetailsSettingsFormSchema = z.infer<
  typeof roleDetailsSettingsFormSchema
>;
