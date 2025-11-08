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
import { createRoleSchema } from './dto/create-role.dto';
import { updateRoleSchema } from './dto/update-role.dto';
import { deleteRoleSchema } from './dto/delete-role.dto';
import { PERMISSIONS } from 'src/rbac/rbac.constants';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @UseGuards(JwtGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.ROLES_ALL)
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
  @Permissions(PERMISSIONS.ROLES_READ)
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
  @Permissions(PERMISSIONS.ROLES_CREATE)
  @Post()
  async createRole(@Body() body: unknown): Promise<Role> {
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
  @Permissions(PERMISSIONS.ROLES_UPDATE)
  @Put(':id')
  async updateRole(
    @Param('id') id: string,
    @Body() body: unknown,
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
  @Permissions(PERMISSIONS.ROLES_DELETE)
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
}
