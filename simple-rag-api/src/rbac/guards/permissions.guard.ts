import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { RbacService } from '../rbac.service';

interface AuthenticatedRequest {
  user: {
    id: string;
  };
}

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private rbacService: RbacService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredPermissions) return true;

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    const userPerms = await this.rbacService.getUserPermissions(user.id);
    return requiredPermissions.every((perm) => userPerms.includes(perm));
  }
}
