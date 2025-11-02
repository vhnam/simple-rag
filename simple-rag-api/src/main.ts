import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend access
  app.enableCors({
    origin: true, // Allow all origins (or specify: ['http://localhost:3000'])
    credentials: true,
  });

  await app.listen(process.env.API_PORT ?? 4000, '0.0.0.0');
}
bootstrap();
