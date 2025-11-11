import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Pagination } from 'src/common/interfaces/pagination.interface';
import { User } from 'src/entities/user.entity';
import { UserPreference } from 'src/entities/user-preference.entity';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { PermissionsGuard } from 'src/rbac/guards/permissions.guard';
import { Permissions } from 'src/rbac/decorators/permissions.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import {
  GetUsersQueryDto,
  getUsersQuerySchema,
} from './dto/get-users-query.dto';
import { getUserSchema } from './dto/get-user.dto';
import {
  UpdateProfileDto,
  updateProfileSchema,
} from './dto/update-profile.dto';
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
        error instanceof Error ? error.message : 'Failed to fetch users',
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

  @UseGuards(JwtGuard)
  @Get('me/profile')
  async getMyProfile(@CurrentUser() user: { id: string }): Promise<{
    user: User;
    preferences: UserPreference | null;
  }> {
    try {
      return await this.usersService.getUserWithPreferences(user.id);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to fetch profile',
      );
    }
  }

  @UseGuards(JwtGuard)
  @Patch('me/profile')
  async updateMyProfile(
    @CurrentUser() user: { id: string },
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<{ user: User; preferences: UserPreference }> {
    const validationResult = updateProfileSchema.safeParse(updateProfileDto);
    if (!validationResult.success) {
      const errors = validationResult.error.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join(', ');
      throw new BadRequestException(`Validation failed: ${errors}`);
    }

    const validatedData = validationResult.data;

    try {
      return await this.usersService.updateProfile(user.id, validatedData);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to update profile',
      );
    }
  }
}
