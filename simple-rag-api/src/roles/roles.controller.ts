import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { Pagination } from 'src/common/interfaces/pagination.interface';
import { Role } from 'src/entities/role.entity';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { PermissionsGuard } from 'src/rbac/guards/permissions.guard';
import { Permissions } from 'src/rbac/decorators/permissions.decorator';
import {
  GetRolesQueryDto,
  getRolesQuerySchema,
} from './dto/get-roles-query.dto';
import { getRoleSchema } from './dto/get-role.dto';
import { type CreateRoleDto, createRoleSchema } from './dto/create-role.dto';
import { type UpdateRoleDto, updateRoleSchema } from './dto/update-role.dto';
import { deleteRoleSchema } from './dto/delete-role.dto';
import { PERMISSIONS } from 'src/rbac/rbac.constants';
import { User } from 'src/entities/user.entity';
import {
  type GetUsersByRoleQueryDto,
  getUsersByRoleQuerySchema,
} from './dto/get-users-by-role.dto';
import { UsersService } from 'src/users/users.service';
import { RoleAssignmentService } from './role-assignment.service';
import {
  AssignUsersToRoleBodyDto,
  assignUsersToRoleBodySchema,
} from './dto/assign-users-to-role.dto';
import { removeUserFromRoleParamsSchema } from './dto/remove-user-from-role.dto';

@Controller('roles')
export class RolesController {
  constructor(
    private readonly rolesService: RolesService,
    private readonly usersService: UsersService,
    private readonly roleAssignmentService: RoleAssignmentService,
  ) {}

  @UseGuards(JwtGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.ROLES_VIEW_LIST)
  @Get()
  async getRoles(@Query() query: GetRolesQueryDto): Promise<Pagination<Role>> {
    const validationResult = getRolesQuerySchema.safeParse(query);
    if (!validationResult.success) {
      const errors = validationResult.error.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join(', ');
      throw new BadRequestException(`Validation failed: ${errors}`);
    }

    const validatedQuery = validationResult.data;

    try {
      return await this.rolesService.getRoles(validatedQuery);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to fetch roles',
      );
    }
  }

  @UseGuards(JwtGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.ROLES_VIEW_DETAIL)
  @Get(':id')
  async getRole(@Param('id') id: string): Promise<Role> {
    const validationResult = getRoleSchema.safeParse({ id });
    if (!validationResult.success) {
      const errors = validationResult.error.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join(', ');
      throw new BadRequestException(`Validation failed: ${errors}`);
    }

    const validatedParam = validationResult.data;

    try {
      return await this.rolesService.getRole(validatedParam.id);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to fetch role',
      );
    }
  }

  @UseGuards(JwtGuard, PermissionsGuard)
  @Permissions(
    PERMISSIONS.ROLES_CREATE,
    PERMISSIONS.PERMISSIONS_VIEW_LIST,
    PERMISSIONS.USERS_VIEW_LIST,
  )
  @Post()
  async createRole(@Body() body: CreateRoleDto): Promise<Role> {
    const validationResult = createRoleSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join(', ');
      throw new BadRequestException(`Validation failed: ${errors}`);
    }

    const validatedBody = validationResult.data;

    try {
      return await this.rolesService.createRole(validatedBody);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to create role',
      );
    }
  }

  @UseGuards(JwtGuard, PermissionsGuard)
  @Permissions(
    PERMISSIONS.ROLES_UPDATE,
    PERMISSIONS.ROLES_VIEW_DETAIL,
    PERMISSIONS.PERMISSIONS_VIEW_LIST,
    PERMISSIONS.USERS_VIEW_LIST,
  )
  @Put(':id')
  async updateRole(
    @Param('id') id: string,
    @Body() body: UpdateRoleDto,
  ): Promise<Role> {
    const validationResult = updateRoleSchema.safeParse({
      id,
      ...(body as Record<string, unknown>),
    });
    if (!validationResult.success) {
      const errors = validationResult.error.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join(', ');
      throw new BadRequestException(`Validation failed: ${errors}`);
    }

    const validatedData = validationResult.data;

    try {
      return await this.rolesService.updateRole(validatedData);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to update role',
      );
    }
  }

  @UseGuards(JwtGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.ROLES_DELETE, PERMISSIONS.ROLES_VIEW_DETAIL)
  @Delete(':id')
  async deleteRole(@Param('id') id: string): Promise<{ message: string }> {
    const validationResult = deleteRoleSchema.safeParse({ id });
    if (!validationResult.success) {
      const errors = validationResult.error.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join(', ');
      throw new BadRequestException(`Validation failed: ${errors}`);
    }

    const validatedParam = validationResult.data;

    try {
      await this.rolesService.deleteRole(validatedParam.id);
      return { message: 'Role deleted successfully' };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to delete role',
      );
    }
  }

  @UseGuards(JwtGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.ROLES_VIEW_DETAIL, PERMISSIONS.USERS_VIEW_LIST)
  @Get(':id/users')
  async getRoleUsers(
    @Param('id') id: string,
    @Query() query: GetUsersByRoleQueryDto,
  ): Promise<Pagination<User>> {
    const validationResult = getUsersByRoleQuerySchema.safeParse({
      ...query,
      roleId: id,
    });
    if (!validationResult.success) {
      const errors = validationResult.error.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join(', ');
      throw new BadRequestException(`Validation failed: ${errors}`);
    }

    const validatedQuery = validationResult.data;

    try {
      return await this.usersService.getUsersByRole(validatedQuery);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to fetch role users',
      );
    }
  }

  @UseGuards(JwtGuard, PermissionsGuard)
  @Permissions(
    PERMISSIONS.ROLES_VIEW_DETAIL,
    PERMISSIONS.USERS_VIEW_LIST,
    PERMISSIONS.USERS_UPDATE,
  )
  @Post(':id/assign-users')
  async assignUsersToRole(
    @Param('id') id: string,
    @Body() body: AssignUsersToRoleBodyDto,
  ): Promise<{ message: string }> {
    const validationResult = assignUsersToRoleBodySchema.safeParse({
      roleId: id,
      ...body,
    });
    if (!validationResult.success) {
      const errors = validationResult.error.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join(', ');
      throw new BadRequestException(`Validation failed: ${errors}`);
    }

    const validatedBody = validationResult.data;

    try {
      await this.roleAssignmentService.assignUsersToRole(
        id,
        validatedBody.userIds,
      );
      return { message: 'Users assigned to role successfully' };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Failed to assign users to role',
      );
    }
  }

  @UseGuards(JwtGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.ROLES_VIEW_DETAIL, PERMISSIONS.USERS_UPDATE)
  @Delete(':id/remove-user/:userId')
  async removeUserFromRole(
    @Param('id') id: string,
    @Param('userId') userId: string,
  ): Promise<{ message: string }> {
    const validationResult = removeUserFromRoleParamsSchema.safeParse({
      roleId: id,
      userId,
    });
    if (!validationResult.success) {
      const errors = validationResult.error.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join(', ');
      throw new BadRequestException(`Validation failed: ${errors}`);
    }

    const validatedBody = validationResult.data;

    try {
      await this.roleAssignmentService.removeUserFromRole(
        validatedBody.roleId,
        validatedBody.userId,
      );
      return { message: 'User removed from role successfully' };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Failed to remove user from role',
      );
    }
  }
}
