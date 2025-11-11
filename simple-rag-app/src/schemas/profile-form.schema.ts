import z from 'zod';

export const profileFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(255, 'Name must be at most 255 characters'),
  email: z.email('Invalid email address'),
  interface_theme: z.enum(['light', 'dark', 'system']),
  interface_language: z.enum(['en-US', 'vi-VN']),
  ai_language: z.enum(['en-US', 'vi-VN']),
});

export type ProfileFormSchema = z.infer<typeof profileFormSchema>;
