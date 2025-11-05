import { Injectable } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { UserRole } from '../entities/user-role.entity';

@Injectable()
export class RbacService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async getUserPermissions(userId: string): Promise<string[]> {
    const user = await this.userRepository.findOne({
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

  async assignRoleToUser(userId: string, roleName: string) {
    const role = await this.roleRepository.findOne({
      where: { name: roleName },
    });
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!role || !user) throw new Error('Invalid role or user');

    // Check if the role is already assigned using query builder for reliable column names
    const existingUserRole = await this.userRoleRepository
      .createQueryBuilder('userRole')
      .where('userRole.user_id = :userId', { userId })
      .andWhere('userRole.role_id = :roleId', { roleId: role.id })
      .getOne();

    if (existingUserRole) {
      return; // Role already assigned
    }

    // Insert directly using raw SQL to ensure correct column mapping
    await this.dataSource.query(
      `INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)`,
      [userId, role.id],
    );
  }
}
