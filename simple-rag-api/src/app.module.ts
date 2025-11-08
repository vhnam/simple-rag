import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { WinstonModule } from 'nest-winston';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RagModule } from './rag/rag.module';
import { DatabaseModule } from './database/database.module';
import { EnvSchema } from './config/env.shema';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { createThrottlerConfig } from './config/throttler.config';
import { createLoggerConfig } from './config/logger.config';
import { HttpLoggerMiddleware } from './common/middleware/http-logger.middleware';
import { RecipesModule } from './recipes/recipes.module';
import { UsersModule } from './users/users.module';
import { RbacModule } from './rbac/rbac.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => EnvSchema.parse(config),
    }),
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        createLoggerConfig(configService),
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        createThrottlerConfig(configService),
    }),
    DatabaseModule,
    RagModule,
    AuthModule,
    HealthModule,
    RecipesModule,
    UsersModule,
    RbacModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply HTTP logger middleware to all routes
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
