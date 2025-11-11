import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from '../entities/user.entity';
import { UserPreference } from '../entities/user-preference.entity';
import { RbacModule } from 'src/rbac/rbac.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserPreference]), RbacModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
