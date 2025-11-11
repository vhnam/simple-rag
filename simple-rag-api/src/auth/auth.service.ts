import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserPreference } from '../entities/user-preference.entity';
import { AuthSyncUserDto } from './dto/auth.dto';
import { RbacService } from '../rbac/rbac.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserPreference)
    private userPreferenceRepository: Repository<UserPreference>,
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

      // Assign default role
      await this.rbacService.assignRoleToUser(user.id, 'viewer');

      // Create default user preferences
      const defaultPreferences = this.userPreferenceRepository.create({
        user_id: user.id,
        interface_theme: 'system',
        interface_language: 'en-US',
        ai_language: 'en-US',
      });
      await this.userPreferenceRepository.save(defaultPreferences);

      // Reload user with relations after assigning role
      user = await this.userRepository.findOne({
        where: { id: user.id },
        relations: ['userRoles', 'userRoles.role'],
      });

      if (!user) {
        throw new Error('Failed to reload user after role assignment');
      }
    } else {
      // If user exists but has no roles, assign default 'viewer' role
      if (!user.userRoles || user.userRoles.length === 0) {
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

      // Check if user has preferences, if not create default ones
      const existingPreferences = await this.userPreferenceRepository.findOne({
        where: { user_id: user.id },
      });

      if (!existingPreferences) {
        const defaultPreferences = this.userPreferenceRepository.create({
          user_id: user.id,
          interface_theme: 'system',
          interface_language: 'en-US',
          ai_language: 'en-US',
        });
        await this.userPreferenceRepository.save(defaultPreferences);
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
