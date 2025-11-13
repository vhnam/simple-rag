import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { RagService } from './rag.service';
import { askInstrumentSchema } from './dto/ask-instrument.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@Controller('rag')
export class RagController {
  private readonly logger = new Logger(RagController.name);

  constructor(private readonly ragService: RagService) {}

  // Stricter rate limit for public AI-powered endpoint (expensive operation)
  @Throttle({
    short: { limit: 3, ttl: 1000 },
    medium: { limit: 10, ttl: 60000 },
  })
  @Post('ask')
  @HttpCode(HttpStatus.OK)
  async ask(@Body() body: unknown): Promise<{
    status: string;
    query: string;
    answer: object | null;
    instruments: unknown[];
    error?: { code: string; message: string };
    meta: {
      retrievedCount: number | null;
      embeddingModel: string;
      llmModel: string;
      durationMs: number;
    };
    timestamp: string;
  }> {
    const validationResult = askInstrumentSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.issues
        .map((issue) => {
          const path = issue.path.length > 0 ? issue.path.join('.') : 'root';
          return `${path}: ${issue.message}`;
        })
        .join(', ');
      this.logger.warn(`Validation failed for /rag/ask: ${errors}`, {
        body,
        issues: validationResult.error.issues,
      });
      throw new BadRequestException(`Validation failed: ${errors}`);
    }

    const askInstrumentDto = validationResult.data;

    // RagService now returns standardized response format
    // All error handling is done inside the service, returning error status
    return await this.ragService.ask(askInstrumentDto);
  }

  // Stricter rate limit for public AI-powered endpoint (expensive operation)
  @Throttle({
    short: { limit: 3, ttl: 1000 },
    medium: { limit: 10, ttl: 60000 },
  })
  @Post('recommend-instruments')
  @HttpCode(HttpStatus.OK)
  async recommendInstruments(@Body() body: unknown): Promise<{
    status: string;
    query: string;
    answer: object | null;
    instruments: unknown[];
    error?: { code: string; message: string };
    meta: {
      retrievedCount: number | null;
      embeddingModel: string;
      llmModel: string;
      durationMs: number;
    };
    timestamp: string;
  }> {
    const validationResult = askInstrumentSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.issues
        .map((issue) => {
          const path = issue.path.length > 0 ? issue.path.join('.') : 'root';
          return `${path}: ${issue.message}`;
        })
        .join(', ');
      this.logger.warn(
        `Validation failed for /rag/recommend-instruments: ${errors}`,
      );
      throw new BadRequestException(`Validation failed: ${errors}`);
    }

    const askInstrumentDto = validationResult.data;

    // Use the same ask method which handles structured preferences
    return await this.ragService.ask(askInstrumentDto);
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
