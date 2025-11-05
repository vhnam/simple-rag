import z from 'zod';

export const authSyncUserSchema = z.object({
  sub: z.string().min(1, 'Subject cannot be empty').trim(),
  email: z.string().min(1, 'Email cannot be empty').trim(),
  name: z.string().min(1, 'Name cannot be empty').trim(),
  picture: z.string().optional(),
});

export type AuthSyncUserDto = z.infer<typeof authSyncUserSchema>;
