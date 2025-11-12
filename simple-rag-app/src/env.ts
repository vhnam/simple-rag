import { createEnv } from '@t3-oss/env-core';

import { z } from 'zod';

export const env = createEnv({
  server: {
    SERVER_URL: z.url(),
  },

  /**
   * The prefix that client-side variables must have. This is enforced both at
   * a type-level and at runtime.
   */
  clientPrefix: 'VITE_',

  client: {
    VITE_APP_TITLE: z.string().min(1),
    VITE_API_URL: z.url(),
    VITE_AUTH0_DOMAIN: z.string().min(1),
    VITE_AUTH0_CLIENT_ID: z.string().min(1),
  },

  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   */
  runtimeEnv: {
    // Server-side variables (only available during SSR)
    SERVER_URL: import.meta.env.SERVER_URL ?? process.env.SERVER_URL,

    // Client-side variables (available in browser)
    VITE_APP_TITLE: import.meta.env.VITE_APP_TITLE,
    VITE_API_URL: import.meta.env.VITE_API_URL,
    VITE_AUTH0_DOMAIN: import.meta.env.VITE_AUTH0_DOMAIN,
    VITE_AUTH0_CLIENT_ID: import.meta.env.VITE_AUTH0_CLIENT_ID,
  },

  /**
   * By default, this library will feed the environment variables directly to
   * the Zod validator.
   *
   * This means that if you have an empty string for a value that is supposed
   * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
   * it as a type mismatch violation. Additionally, if you have an empty string
   * for a value that is supposed to be a string with a default value (e.g.
   * `DOMAIN=` in an ".env" file), the default value will never be applied.
   *
   * In order to solve these issues, we recommend that all new projects
   * explicitly specify this option as true.
   */
  emptyStringAsUndefined: true,
});
