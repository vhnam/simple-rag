import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Recipe } from '../entities/recipe.entity';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { UserRole } from '../entities/user-role.entity';
import { Permission } from '../entities/permission.entity';
import { RolePermission } from '../entities/role-permission.entity';
import { MigrationService } from './migration.service';
import { SeedService } from './seed.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: Number.parseInt(
          configService.get<string>('DB_PORT') || '5432',
          10,
        ),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [Recipe, User, Role, UserRole, Permission, RolePermission],
        synchronize: false, // We'll use migrations
        logging: ['query', 'error'],
        extra: {
          // Enable pgvector extension connection
          options: '-c search_path=public',
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Recipe, User]),
  ],
  providers: [MigrationService, SeedService],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
