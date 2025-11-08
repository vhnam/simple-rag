import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { Role } from 'src/entities/role.entity';
import { Permission } from 'src/entities/permission.entity';
import { RolePermission } from 'src/entities/role-permission.entity';
import { GetRolesQueryDto } from './dto/get-roles-query.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Pagination } from 'src/common/interfaces/pagination.interface';

@Injectable()
export class RolesService {
  private readonly logger = new Logger(RolesService.name);

  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
    @InjectRepository(RolePermission)
    private rolePermissionsRepository: Repository<RolePermission>,
  ) {}

  async getRoles(query: GetRolesQueryDto): Promise<Pagination<Role>> {
    try {
      const { search, page = 1, limit = 10 } = query;
      const skip = (page - 1) * limit;

      // Build where clause for search
      const where: Record<string, unknown> = {};
      if (search) {
        where.name = Like(`%${search}%`);
      }

      // Get total count for pagination
      const total = await this.rolesRepository.count({ where });

      // Get paginated results with permissions
      const data = await this.rolesRepository.find({
        where,
        relations: ['rolePermissions', 'rolePermissions.permission'],
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
      this.logger.error('Error fetching roles', error);
      throw error;
    }
  }

  async getRole(id: string): Promise<Role> {
    try {
      const role = await this.rolesRepository.findOne({
        where: { id },
        relations: ['rolePermissions', 'rolePermissions.permission'],
      });
      if (!role) {
        throw new Error(`Role with ID ${id} not found`);
      }
      return role;
    } catch (error) {
      this.logger.error('Error fetching role', error);
      throw error;
    }
  }

  async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    try {
      const { name, description, permissionIds } = createRoleDto;

      // Check if role with same name already exists
      const existingRole = await this.rolesRepository.findOne({
        where: { name },
      });
      if (existingRole) {
        throw new Error(`Role with name "${name}" already exists`);
      }

      // Verify all permissions exist
      const permissions = await this.permissionsRepository.find({
        where: { id: In(permissionIds) },
      });
      if (permissions.length !== permissionIds.length) {
        throw new Error('One or more permission IDs are invalid');
      }

      // Create the role
      const role = this.rolesRepository.create({
        name,
        description,
      });
      const savedRole = await this.rolesRepository.save(role);

      // Create role-permission associations
      const rolePermissions = permissions.map((permission) =>
        this.rolePermissionsRepository.create({
          role: savedRole,
          permission,
        }),
      );
      await this.rolePermissionsRepository.save(rolePermissions);

      // Return the role with permissions
      return this.getRole(savedRole.id);
    } catch (error) {
      this.logger.error('Error creating role', error);
      throw error;
    }
  }

  async updateRole(updateRoleDto: UpdateRoleDto): Promise<Role> {
    try {
      const { id, name, description, permissionIds } = updateRoleDto;

      // Check if role exists
      const role = await this.rolesRepository.findOne({ where: { id } });
      if (!role) {
        throw new Error(`Role with ID ${id} not found`);
      }

      // If name is being updated, check for conflicts
      if (name && name !== role.name) {
        const existingRole = await this.rolesRepository.findOne({
          where: { name },
        });
        if (existingRole) {
          throw new Error(`Role with name "${name}" already exists`);
        }
        role.name = name;
      }

      // Update description if provided
      if (description !== undefined) {
        role.description = description;
      }

      // Save role updates
      await this.rolesRepository.save(role);

      // Update permissions if provided
      if (permissionIds) {
        // Verify all permissions exist
        const permissions = await this.permissionsRepository.find({
          where: { id: In(permissionIds) },
        });
        if (permissions.length !== permissionIds.length) {
          throw new Error('One or more permission IDs are invalid');
        }

        // Remove existing role-permission associations
        await this.rolePermissionsRepository.delete({ role: { id } });

        // Create new role-permission associations
        const rolePermissions = permissions.map((permission) =>
          this.rolePermissionsRepository.create({
            role,
            permission,
          }),
        );
        await this.rolePermissionsRepository.save(rolePermissions);
      }

      // Return the updated role with permissions
      return this.getRole(id);
    } catch (error) {
      this.logger.error('Error updating role', error);
      throw error;
    }
  }

  async deleteRole(id: string): Promise<void> {
    try {
      const role = await this.rolesRepository.findOne({
        where: { id },
        relations: ['userRoles'],
      });
      if (!role) {
        throw new Error(`Role with ID ${id} not found`);
      }

      // Check if role is assigned to any users
      if (role.userRoles && role.userRoles.length > 0) {
        throw new Error(
          `Cannot delete role "${role.name}" as it is assigned to ${role.userRoles.length} user(s)`,
        );
      }

      // Delete the role (role-permission associations will be cascade deleted)
      await this.rolesRepository.remove(role);
    } catch (error) {
      this.logger.error('Error deleting role', error);
      throw error;
    }
  }
}
