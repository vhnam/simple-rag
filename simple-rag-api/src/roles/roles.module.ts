import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { Role } from 'src/entities/role.entity';
import { Permission } from 'src/entities/permission.entity';
import { RolePermission } from 'src/entities/role-permission.entity';
import { RbacModule } from 'src/rbac/rbac.module';
import { RoleAssignmentService } from './role-assignment.service';
import { User } from 'src/entities/user.entity';
import { UserRole } from 'src/entities/user-role.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Role,
      Permission,
      RolePermission,
      User,
      UserRole,
    ]),
    RbacModule,
    UsersModule,
  ],
  controllers: [RolesController],
  providers: [RolesService, RoleAssignmentService],
  exports: [RolesService, RoleAssignmentService],
})
export class RolesModule {}
