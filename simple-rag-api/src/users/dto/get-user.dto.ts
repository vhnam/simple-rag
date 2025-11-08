import { z } from 'zod';

export const getUserSchema = z.object({
  id: z.string().uuid({ message: 'Invalid user ID format' }),
});

export type GetUserDto = z.infer<typeof getUserSchema>;
