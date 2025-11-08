import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { Role } from 'src/entities/role.entity';
import { Permission } from 'src/entities/permission.entity';
import { RolePermission } from 'src/entities/role-permission.entity';
import { RbacModule } from 'src/rbac/rbac.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, Permission, RolePermission]),
    RbacModule,
  ],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
