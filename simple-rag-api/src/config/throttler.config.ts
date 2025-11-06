import { ThrottlerModuleOptions } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';

/**
 * Creates rate limiting configuration based on environment settings
 * @param configService - NestJS ConfigService instance
 * @returns ThrottlerModuleOptions configuration array
 */
export function createThrottlerConfig(
  configService: ConfigService,
): ThrottlerModuleOptions {
  const nodeEnv = configService.get<string>('NODE_ENV');

  // In production, enforce stricter rate limits
  // In development, use more relaxed limits for testing
  const isProduction = nodeEnv === 'production';

  return {
    throttlers: [
      {
        name: 'short',
        // Short-term burst protection
        ttl: 1000, // 1 second
        limit: isProduction ? 5 : 20, // 5 requests/sec in prod, 20 in dev
      },
      {
        name: 'medium',
        // Medium-term protection
        ttl: 60000, // 1 minute
        limit: isProduction ? 30 : 100, // 30 requests/min in prod, 100 in dev
      },
      {
        name: 'long',
        // Long-term protection
        ttl: 900000, // 15 minutes
        limit: isProduction ? 100 : 500, // 100 requests/15min in prod, 500 in dev
      },
    ],
    // Skip rate limiting for these user agents (e.g., health checks)
    skipIf: () => nodeEnv === 'test',
  };
}
