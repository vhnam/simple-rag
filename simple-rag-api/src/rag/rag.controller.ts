import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { RagService } from './rag.service';
import {
  RecipeDto,
  AddRecipeResponseDto,
  AskRecipeResponseDto,
  askRecipeSchema,
  addRecipeSchema,
  AddRecipeDto,
  AskRecipeDto,
} from './dto/ask-recipe.dto';

@Controller('rag')
export class RagController {
  constructor(private readonly ragService: RagService) {}

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

  @Post('recipes')
  @HttpCode(HttpStatus.CREATED)
  async addRecipe(@Body() body: AddRecipeDto): Promise<AddRecipeResponseDto> {
    const validationResult = addRecipeSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join(', ');
      throw new BadRequestException(`Validation failed: ${errors}`);
    }

    const addRecipeDto = validationResult.data;

    try {
      const id = await this.ragService.addRecipe(
        addRecipeDto.name,
        addRecipeDto.ingredients,
        addRecipeDto.instructions,
      );
      return {
        id,
        message: `Recipe "${addRecipeDto.name}" added successfully`,
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to add recipe',
      );
    }
  }

  @Get('recipes')
  async getRecipes(): Promise<RecipeDto[]> {
    try {
      return await this.ragService.getAllRecipes();
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to fetch recipes',
      );
    }
  }

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
