import { Module, OnModuleInit, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RbacService } from './rbac.service';
import { PermissionsGuard } from './guards/permissions.guard';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { UserRole } from '../entities/user-role.entity';
import { Permission } from '../entities/permission.entity';
import { PermissionSyncService } from 'src/rbac/permission-sync.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, UserRole, Permission]),
    forwardRef(() => UsersModule),
  ],
  providers: [RbacService, PermissionsGuard, PermissionSyncService],
  exports: [RbacService, PermissionsGuard, PermissionSyncService],
})
export class RbacModule implements OnModuleInit {
  constructor(private readonly permissionSyncService: PermissionSyncService) {}

  async onModuleInit(): Promise<void> {
    if (process.env.NODE_ENV !== 'production') {
      await this.permissionSyncService.syncPermissionsFromControllers();
    }
  }
}
