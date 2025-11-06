import { z } from 'zod';

export const EnvSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  API_PORT: z.coerce.number().default(4000),
  DB_HOST: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  DB_PORT: z.string(),
  OPENAI_API_KEY: z.string(),
  AUTH0_ISSUER_URL: z.string(),
  AUTH0_AUDIENCE: z.string(),
  ALLOWED_ORIGINS: z
    .string()
    .optional()
    .default('http://localhost:3000,http://localhost:5173'),
});

export type Env = z.infer<typeof EnvSchema>;
