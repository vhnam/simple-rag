import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Role } from 'src/entities/role.entity';
import { UserRole } from 'src/entities/user-role.entity';
import { User } from 'src/entities/user.entity';
import { In, Repository, DataSource } from 'typeorm';

@Injectable()
export class RoleAssignmentService {
  private readonly logger = new Logger(RoleAssignmentService.name);

  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(UserRole)
    private userRolesRepository: Repository<UserRole>,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async assignUsersToRole(roleId: string, userIds: string[]): Promise<void> {
    try {
      // Verify role exists
      const role = await this.rolesRepository.findOne({
        where: { id: roleId },
      });
      if (!role) {
        throw new Error(`Role with ID ${roleId} not found`);
      }

      // Verify all users exist
      const users = await this.usersRepository.find({
        where: { id: In(userIds) },
      });
      if (users.length !== userIds.length) {
        throw new Error('One or more user IDs are invalid');
      }

      // Get existing user-role associations for this role
      const existingUserRoles = await this.userRolesRepository.find({
        where: {
          role: { id: roleId },
        },
        relations: ['user'],
      });

      const existingUserIds = existingUserRoles.map((ur) => ur.user.id);

      // Find users that need to be added (not already assigned)
      const usersToAdd = users.filter(
        (user) => !existingUserIds.includes(user.id),
      );

      // Create new user-role associations
      if (usersToAdd.length > 0) {
        const newUserRoles = usersToAdd.map((user) =>
          this.userRolesRepository.create({
            user,
            role,
          }),
        );
        await this.userRolesRepository.save(newUserRoles);
      }

      this.logger.log(
        `Assigned ${usersToAdd.length} user(s) to role "${role.name}"`,
      );
    } catch (error) {
      this.logger.error('Error assigning users to role', error);
      throw error;
    }
  }

  async removeUserFromRole(roleId: string, userId: string): Promise<void> {
    try {
      // Use a transaction to ensure atomicity and prevent race conditions
      await this.dataSource.transaction(async (manager) => {
        // Verify role exists
        const role = await manager.findOne(Role, {
          where: { id: roleId },
        });
        if (!role) {
          throw new Error(`Role with ID ${roleId} not found`);
        }

        // Find the user-role association with a lock to prevent concurrent modifications
        const userRole = await manager.findOne(UserRole, {
          where: { role: { id: roleId }, user: { id: userId } },
          lock: { mode: 'pessimistic_write' }, // Lock the row to prevent concurrent access
        });
        if (!userRole) {
          throw new Error(
            `User with ID ${userId} not found in role "${role.name}"`,
          );
        }

        // Check if user has other roles (within the transaction, so count is accurate)
        const userRolesCount = await manager.count(UserRole, {
          where: { user: { id: userId } },
        });

        if (userRolesCount < 2) {
          throw new Error(
            'Cannot remove user from role. User must have at least one role.',
          );
        }

        // Remove the role (atomic within the transaction)
        await manager.remove(UserRole, userRole);
      });
    } catch (error) {
      this.logger.error('Error removing user from role', error);
      throw error;
    }
  }
}
