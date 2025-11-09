import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscoveryModule } from '@nestjs/core';
import { RbacService } from './rbac.service';
import { PermissionsGuard } from './guards/permissions.guard';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { UserRole } from '../entities/user-role.entity';
import { Permission } from '../entities/permission.entity';
import { PermissionSyncService } from 'src/rbac/permission-sync.service';

@Module({
  imports: [
    DiscoveryModule,
    TypeOrmModule.forFeature([User, Role, UserRole, Permission]),
  ],
  providers: [RbacService, PermissionsGuard, PermissionSyncService],
  exports: [RbacService, PermissionsGuard, PermissionSyncService],
})
export class RbacModule {}
