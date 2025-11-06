import { WinstonModuleOptions } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';

/**
 * Creates structured logging configuration based on environment settings
 * @param configService - NestJS ConfigService instance
 * @returns WinstonModuleOptions configuration object
 */
export function createLoggerConfig(
  configService: ConfigService,
): WinstonModuleOptions {
  const nodeEnv = configService.get<string>('NODE_ENV');
  const isProduction = nodeEnv === 'production';

  // Define log format based on environment
  const consoleFormat = isProduction
    ? // Production: JSON format for log aggregation tools (ELK, Datadog, etc.)
      winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.json(),
      )
    : // Development: Human-readable format with colors
      winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.colorize({ all: true }),
        winston.format.printf(
          ({
            timestamp,
            level,
            message,
            context,
            ...meta
          }: winston.Logform.TransformableInfo) => {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-base-to-string
            let log = `${timestamp} [${context || 'Application'}] ${level}: ${message}`;

            // Add metadata if present
            if (Object.keys(meta).length > 0) {
              log += `\n${JSON.stringify(meta, null, 2)}`;
            }

            return log;
          },
        ),
      );

  return {
    transports: [
      // Console transport
      new winston.transports.Console({
        format: consoleFormat,
        level: isProduction ? 'info' : 'debug',
      }),

      // Error log file (production only)
      ...(isProduction
        ? [
            new winston.transports.File({
              filename: 'logs/error.log',
              level: 'error',
              format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
              ),
              maxsize: 10485760, // 10MB
              maxFiles: 5,
            }),
            new winston.transports.File({
              filename: 'logs/combined.log',
              format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
              ),
              maxsize: 10485760, // 10MB
              maxFiles: 5,
            }),
          ]
        : []),
    ],
    // Prevent winston from exiting on error
    exitOnError: false,
  };
}
