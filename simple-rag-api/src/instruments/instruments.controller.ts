import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { InstrumentsService } from './instruments.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { PermissionsGuard } from '../rbac/guards/permissions.guard';
import { Permissions } from '../rbac/decorators/permissions.decorator';
import { Instrument } from '../entities/instrument.entity';
import {
  GetInstrumentsQueryDto,
  getInstrumentsQuerySchema,
} from './dto/get-instruments-query.dto';
import {
  CreateInstrumentDto,
  CreateInstrumentResponseDto,
  createInstrumentSchema,
} from './dto/create-instrument.dto';
import { Pagination } from '../common/interfaces/pagination.interface';
import { PERMISSIONS } from '../rbac/rbac.constants';

@Controller('instruments')
export class InstrumentsController {
  constructor(private readonly instrumentsService: InstrumentsService) {}

  @UseGuards(JwtGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.INSTRUMENTS_VIEW_LIST)
  @Get()
  async getInstruments(
    @Query() query: GetInstrumentsQueryDto,
  ): Promise<Pagination<Instrument>> {
    const validationResult = getInstrumentsQuerySchema.safeParse(query);
    if (!validationResult.success) {
      const errors = validationResult.error.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join(', ');
      throw new BadRequestException(`Validation failed: ${errors}`);
    }

    const validatedQuery = validationResult.data;

    try {
      return await this.instrumentsService.getInstruments(validatedQuery);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to fetch instruments',
      );
    }
  }

  @UseGuards(JwtGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.INSTRUMENTS_VIEW_LIST)
  @Get('recommended-for-beginners')
  async getRecommendedForBeginners(): Promise<Instrument[]> {
    try {
      return await this.instrumentsService.getRecommendedForBeginners();
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Failed to fetch recommended instruments',
      );
    }
  }

  @UseGuards(JwtGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.INSTRUMENTS_VIEW_LIST)
  @Get(':id')
  async getInstrumentById(@Param('id') id: string): Promise<Instrument> {
    try {
      return await this.instrumentsService.getInstrumentById(id);
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to fetch instrument',
      );
    }
  }

  @UseGuards(JwtGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.INSTRUMENTS_CREATE)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createInstrument(
    @Body() body: CreateInstrumentDto,
  ): Promise<CreateInstrumentResponseDto> {
    const validationResult = createInstrumentSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join(', ');
      throw new BadRequestException(`Validation failed: ${errors}`);
    }

    const createInstrumentDto = validationResult.data;

    try {
      const id =
        await this.instrumentsService.createInstrument(createInstrumentDto);
      return {
        id,
        message: `Instrument "${createInstrumentDto.name}" created successfully`,
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to create instrument',
      );
    }
  }
}
