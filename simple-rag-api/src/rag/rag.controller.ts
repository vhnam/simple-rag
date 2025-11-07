import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { RagService } from './rag.service';
import {
  AskRecipeResponseDto,
  askRecipeSchema,
  AskRecipeDto,
} from './dto/ask-recipe.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@Controller('rag')
export class RagController {
  constructor(private readonly ragService: RagService) {}

  // Stricter rate limit for public AI-powered endpoint (expensive operation)
  @Throttle({
    short: { limit: 3, ttl: 1000 },
    medium: { limit: 10, ttl: 60000 },
  })
  @Post('ask')
  @HttpCode(HttpStatus.OK)
  async ask(@Body() body: AskRecipeDto): Promise<AskRecipeResponseDto> {
    const validationResult = askRecipeSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join(', ');
      throw new BadRequestException(`Validation failed: ${errors}`);
    }

    const askRecipeDto = validationResult.data;

    // RagService now returns standardized response format
    // All error handling is done inside the service, returning error status
    return await this.ragService.ask(askRecipeDto.ingredients);
  }

  @UseGuards(JwtGuard)
  @Get('status')
  async getStatus(): Promise<{ ready: boolean; count: number }> {
    try {
      return await this.ragService.getStatus();
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to get RAG status',
      );
    }
  }
}
