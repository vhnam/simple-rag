import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  email: z.string().email().max(255).optional(),
  avatar: z.string().max(500).optional(),
  interface_theme: z.enum(['light', 'dark', 'system']).optional(),
  interface_language: z.enum(['en-US', 'vi-VN']).optional(),
  ai_language: z.enum(['en-US', 'vi-VN']).optional(),
});

export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;
