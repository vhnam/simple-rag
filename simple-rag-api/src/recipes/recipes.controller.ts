import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { PermissionsGuard } from 'src/rbac/guards/permissions.guard';
import { Permissions } from 'src/rbac/decorators/permissions.decorator';
import { Recipe } from 'src/entities/recipe.entity';
import {
  GetRecipesQueryDto,
  getRecipesQuerySchema,
} from './dto/get-recipes-query.dto';
import {
  AddRecipeDto,
  AddRecipeResponseDto,
  addRecipeSchema,
} from './dto/add-recipe.dto';
import { Pagination } from 'src/common/interfaces/pagination.interface';
import { PERMISSIONS } from 'src/rbac/rbac.constants';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @UseGuards(JwtGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.RECIPES_VIEW_LIST)
  @Get()
  async getRecipes(
    @Query() query: GetRecipesQueryDto,
  ): Promise<Pagination<Recipe>> {
    const validationResult = getRecipesQuerySchema.safeParse(query);
    if (!validationResult.success) {
      const errors = validationResult.error.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join(', ');
      throw new BadRequestException(`Validation failed: ${errors}`);
    }

    const validatedQuery = validationResult.data;

    try {
      return await this.recipesService.getRecipes(validatedQuery);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to fetch recipes',
      );
    }
  }

  @UseGuards(JwtGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.RECIPES_CREATE)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createRecipe(
    @Body() body: AddRecipeDto,
  ): Promise<AddRecipeResponseDto> {
    const validationResult = addRecipeSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join(', ');
      throw new BadRequestException(`Validation failed: ${errors}`);
    }

    const addRecipeDto = validationResult.data;

    try {
      const id = await this.recipesService.createRecipe(
        addRecipeDto.name,
        addRecipeDto.ingredients,
        addRecipeDto.instructions,
      );
      return {
        id,
        message: `Recipe "${addRecipeDto.name}" created successfully`,
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to create recipe',
      );
    }
  }
}
