import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

/**
 * HTTP request/response logging middleware
 * Logs all incoming requests and outgoing responses with structured data
 */
@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const startTime = Date.now();
    const { method, originalUrl, ip, headers } = req;

    // Log incoming request
    this.logger.info('Incoming request', {
      context: 'HTTP',
      method,
      url: originalUrl,
      ip: ip || headers['x-forwarded-for'] || 'unknown',
      userAgent: headers['user-agent'],
    });

    // Capture response
    const originalSend = res.send;
    res.send = function (data): Response {
      res.send = originalSend;
      return res.send(data);
    };

    // Log response on finish
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const { statusCode } = res;

      const logLevel = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';

      this.logger.log(logLevel, 'Outgoing response', {
        context: 'HTTP',
        method,
        url: originalUrl,
        statusCode,
        duration: `${duration}ms`,
        ip: ip || headers['x-forwarded-for'] || 'unknown',
      });
    });

    next();
  }
}
