import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserPreference } from 'src/entities/user-preference.entity';
import { Like, Repository } from 'typeorm';
import { GetUsersQueryDto } from './dto/get-users-query.dto';
import { Pagination } from 'src/common/interfaces/pagination.interface';
import { GetUsersByRoleQueryDto } from 'src/roles/dto/get-users-by-role.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(UserPreference)
    private userPreferencesRepository: Repository<UserPreference>,
  ) {}

  async getUserPermissions(userId: string): Promise<string[]> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: [
        'userRoles',
        'userRoles.role',
        'userRoles.role.rolePermissions',
        'userRoles.role.rolePermissions.permission',
      ],
    });

    if (!user) return [];

    return user.userRoles.flatMap((userRole) =>
      userRole.role.rolePermissions.map(
        (rolePermission) => rolePermission.permission.name,
      ),
    );
  }

  async getUsers(query: GetUsersQueryDto): Promise<Pagination<User>> {
    try {
      const { search, page = 1, limit = 10 } = query;
      const skip = (page - 1) * limit;

      // Build where clause for search
      const where: Record<string, unknown> = {};
      if (search) {
        where.name = Like(`%${search}%`);
      }

      // Get total count for pagination
      const total = await this.usersRepository.count({ where });

      // Get paginated results with roles
      const data = await this.usersRepository.find({
        where,
        relations: ['userRoles', 'userRoles.role'],
        order: {
          created_at: 'DESC',
        },
        skip,
        take: limit,
      });

      const totalPages = Math.ceil(total / limit);

      return {
        data,
        total,
        page,
        limit,
        totalPages,
      };
    } catch (error) {
      this.logger.error('Error fetching users', error);
      throw error;
    }
  }

  async getUser(id: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({ where: { id } });
      if (!user) {
        throw new Error(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      this.logger.error('Error fetching user', error);
      throw error;
    }
  }

  async getUsersByRole(
    query: GetUsersByRoleQueryDto,
  ): Promise<Pagination<User>> {
    try {
      const { roleId, search, page = 1, limit = 10 } = query;
      const skip = (page - 1) * limit;

      // Build where clause for search
      const where: Record<string, unknown> = {
        userRoles: {
          role: {
            id: roleId,
          },
        },
      };

      if (search) {
        where.name = Like(`%${search}%`);
      }

      // Get total count for pagination
      const total = await this.usersRepository.count({ where });

      // Get paginated results with roles
      const data = await this.usersRepository.find({
        where,
        relations: ['userRoles', 'userRoles.role'],
        order: {
          created_at: 'DESC',
        },
        skip,
        take: limit,
      });

      const totalPages = Math.ceil(total / limit);

      return {
        data,
        total,
        page,
        limit,
        totalPages,
      };
    } catch (error) {
      this.logger.error('Error fetching users', error);
      throw error;
    }
  }

  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<{ user: User; preferences: UserPreference }> {
    try {
      const {
        name,
        email,
        avatar,
        interface_theme,
        interface_language,
        ai_language,
      } = updateProfileDto;

      // Update user basic info
      const user = await this.usersRepository.findOne({
        where: { id: userId },
      });
      if (!user) {
        throw new Error(`User with ID ${userId} not found`);
      }

      // Update user fields if provided
      if (name !== undefined) user.name = name;
      if (email !== undefined) user.email = email;
      if (avatar !== undefined) user.avatar = avatar;

      await this.usersRepository.save(user);

      // Update or create user preferences
      let preferences = await this.userPreferencesRepository.findOne({
        where: { user_id: userId },
      });

      if (!preferences) {
        // Create new preferences if they don't exist
        preferences = this.userPreferencesRepository.create({
          user_id: userId,
          interface_theme: interface_theme || 'system',
          interface_language: interface_language || 'en-US',
          ai_language: ai_language || 'en-US',
        });
      } else {
        // Update existing preferences if provided
        if (interface_theme !== undefined)
          preferences.interface_theme = interface_theme;
        if (interface_language !== undefined)
          preferences.interface_language = interface_language;
        if (ai_language !== undefined) preferences.ai_language = ai_language;
      }

      await this.userPreferencesRepository.save(preferences);

      return { user, preferences };
    } catch (error) {
      this.logger.error('Error updating user profile', error);
      throw error;
    }
  }

  async getUserWithPreferences(userId: string): Promise<{
    user: User;
    preferences: UserPreference | null;
  }> {
    try {
      const user = await this.usersRepository.findOne({
        where: { id: userId },
      });
      if (!user) {
        throw new Error(`User with ID ${userId} not found`);
      }

      const preferences = await this.userPreferencesRepository.findOne({
        where: { user_id: userId },
      });

      return { user, preferences };
    } catch (error) {
      this.logger.error('Error fetching user with preferences', error);
      throw error;
    }
  }
}
