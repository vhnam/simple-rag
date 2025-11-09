import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Pagination } from 'src/common/interfaces/pagination.interface';
import { User } from 'src/entities/user.entity';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { PermissionsGuard } from 'src/rbac/guards/permissions.guard';
import { Permissions } from 'src/rbac/decorators/permissions.decorator';
import {
  GetUsersQueryDto,
  getUsersQuerySchema,
} from './dto/get-users-query.dto';
import { getUserSchema } from './dto/get-user.dto';
import { PERMISSIONS } from 'src/rbac/rbac.constants';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.USERS_VIEW_LIST)
  @Get()
  async getUsers(@Query() query: GetUsersQueryDto): Promise<Pagination<User>> {
    const validationResult = getUsersQuerySchema.safeParse(query);
    if (!validationResult.success) {
      const errors = validationResult.error.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join(', ');
      throw new BadRequestException(`Validation failed: ${errors}`);
    }

    const validatedQuery = validationResult.data;

    try {
      return await this.usersService.getUsers(validatedQuery);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to fetch recipes',
      );
    }
  }

  @UseGuards(JwtGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.USERS_VIEW_DETAIL)
  @Get(':id')
  async getUser(@Param('id') id: string): Promise<User> {
    const validationResult = getUserSchema.safeParse({ id });
    if (!validationResult.success) {
      const errors = validationResult.error.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join(', ');
      throw new BadRequestException(`Validation failed: ${errors}`);
    }

    const validatedParam = validationResult.data;

    try {
      return await this.usersService.getUser(validatedParam.id);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to fetch user',
      );
    }
  }
}
