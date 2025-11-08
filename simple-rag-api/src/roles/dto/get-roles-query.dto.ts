import { z } from 'zod';

export const getRolesQuerySchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type GetRolesQueryDto = z.infer<typeof getRolesQuerySchema>;
