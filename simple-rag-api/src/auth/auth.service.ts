import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { AuthSyncUserDto } from './dto/auth.dto';
import { RbacService } from '../rbac/rbac.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private rbacService: RbacService,
  ) {}

  async syncUser(
    payload: AuthSyncUserDto,
  ): Promise<User & { role: string[]; permissions: string[] }> {
    const auth0Id = payload.sub;

    let user = await this.userRepository.findOne({
      where: { auth0Id },
      relations: ['userRoles', 'userRoles.role'],
    });

    if (!user) {
      user = this.userRepository.create({
        auth0Id,
        email: payload.email,
        name: payload.name,
        avatar: payload.picture,
      });
      user = await this.userRepository.save(user);

      await this.rbacService.assignRoleToUser(user.id, 'viewer');

      // Reload user with relations after assigning role
      user = await this.userRepository.findOne({
        where: { id: user.id },
        relations: ['userRoles', 'userRoles.role'],
      });

      if (!user) {
        throw new Error('Failed to reload user after role assignment');
      }
    }

    const role = user.userRoles?.map((userRole) => userRole.role.name) || [];
    const permissions = await this.rbacService.getUserPermissions(user.id);

    return {
      ...user,
      role,
      permissions,
    } as User & { role: string[]; permissions: string[] };
  }
}
