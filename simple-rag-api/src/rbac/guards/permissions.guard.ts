import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { RbacService } from '../rbac.service';

interface AuthenticatedRequest extends Request {
  user?: {
    id?: string;
    sub?: string;
  };
}

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private rbac: RbacService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );
    if (!required?.length) return true;

    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const userId: string | undefined = req.user?.id;
    if (!userId) throw new ForbiddenException('Missing user');

    const userPerms = await this.rbac.getUserPermissions(userId);
    const has = required.every((p) => userPerms.includes(p));
    if (!has) throw new ForbiddenException('Insufficient permissions');

    return true;
  }
}
