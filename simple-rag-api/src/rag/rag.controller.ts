import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { RagService } from './rag.service';
import {
  RecipeResponseDto,
  RecipeDto,
  AddRecipeResponseDto,
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
  async ask(@Body() body: AskRecipeDto): Promise<RecipeResponseDto> {
    const validationResult = askRecipeSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join(', ');
      throw new BadRequestException(`Validation failed: ${errors}`);
    }

    const askRecipeDto = validationResult.data;

    try {
      const answer = await this.ragService.ask(askRecipeDto.ingredients);
      return { answer };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Failed to generate recipe suggestions',
      );
    }
  }

  @Get('ask')
  async askGet(@Query('q') q: string): Promise<RecipeResponseDto> {
    if (!q || q.trim().length === 0) {
      throw new BadRequestException('Query parameter "q" cannot be empty');
    }

    try {
      const answer = await this.ragService.ask(q);
      return { answer };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Failed to generate recipe suggestions',
      );
    }
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
}
