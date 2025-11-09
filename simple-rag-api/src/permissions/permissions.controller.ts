import { Controller, Get, UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { PermissionsGuard } from '../rbac/guards/permissions.guard';
import { Permissions } from '../rbac/decorators/permissions.decorator';
import { PERMISSIONS } from '../rbac/rbac.constants';

@Controller('permissions')
@UseGuards(JwtGuard, PermissionsGuard)
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  @Permissions(PERMISSIONS.PERMISSIONS_VIEW_LIST)
  async getPermissions() {
    return this.permissionsService.getGroupedPermissions();
  }
}
