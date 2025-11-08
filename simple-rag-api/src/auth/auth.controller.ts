import {
  Controller,
  Post,
  UseGuards,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSyncUserDto, authSyncUserSchema } from './dto/auth.dto';
import { JwtOptionalGuard } from './guards/jwt-optional.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(JwtOptionalGuard)
  @Post('sync')
  async syncUser(@Body() body: AuthSyncUserDto) {
    const validationResult = authSyncUserSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join(', ');
      throw new BadRequestException(`Validation failed: ${errors}`);
    }
    const authSyncUserDto = validationResult.data;
    return this.authService.syncUser(authSyncUserDto);
  }
}
