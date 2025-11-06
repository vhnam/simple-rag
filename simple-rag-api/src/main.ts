import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app.module';
import { createCorsConfig } from './config/cors.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true, // Buffer logs until custom logger is attached
  });

  // Use Winston logger for all application logs
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);

  const configService = app.get(ConfigService);

  // Enable CORS with environment-aware configuration
  app.enableCors(createCorsConfig(configService));

  const port = process.env.API_PORT ?? 4000;
  await app.listen(port, '0.0.0.0');

  logger.log(`Application is running on: http://localhost:${port}`, 'Bootstrap');
}
bootstrap();
