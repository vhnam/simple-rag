import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';

/**
 * Creates CORS configuration based on environment settings
 * @param configService - NestJS ConfigService instance
 * @returns CorsOptions configuration object
 */
export function createCorsConfig(configService: ConfigService): CorsOptions {
  const nodeEnv = configService.get<string>('NODE_ENV');
  const allowedOrigins = configService.get<string>('ALLOWED_ORIGINS');

  // Parse comma-separated origins into array
  const originsList = allowedOrigins
    ? allowedOrigins.split(',').map((origin) => origin.trim())
    : [];

  return {
    // In development: allow all origins for convenience
    // In production: only allow explicitly configured origins
    origin: nodeEnv === 'development' ? true : originsList,
    credentials: true, // Allow cookies/auth headers
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  };
}
