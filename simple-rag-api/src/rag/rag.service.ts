import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { OpenAIEmbeddings } from '@langchain/openai';
import { ChatOpenAI } from '@langchain/openai';
import { Recipe } from '../entities/recipe.entity';
import {
  AskRecipeResponseDto,
  RecipeDto,
  ErrorDetail,
} from './dto/ask-recipe.dto';
import {
  RAG_EMBEDDING_MODEL,
  RAG_LLM_MODEL,
  RAG_SIMILARITY_THRESHOLD,
} from '../constants/rag.constants';

interface RecipeRow {
  id: string;
  name: string;
  ingredients: string;
  instructions: string;
  similarity?: number;
}

@Injectable()
export class RagService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RagService.name);
  private embeddings: OpenAIEmbeddings | null = null;
  private llm: ChatOpenAI | null = null;

  constructor(
    private configService: ConfigService,
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  onModuleInit(): void {
    const openAiApiKey = this.configService.get<string>('OPENAI_API_KEY');

    if (!openAiApiKey) {
      throw new Error('OPENAI_API_KEY environment variable is missing.');
    }

    // Initialize OpenAI embeddings and LLM
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: openAiApiKey,
    });

    this.llm = new ChatOpenAI({
      openAIApiKey: openAiApiKey,
      modelName: RAG_LLM_MODEL,
      temperature: 1,
    });

    this.logger.log('RAG service initialized');
  }

  onModuleDestroy(): void {
    // TypeORM handles connection cleanup automatically
    this.logger.log('RAG service destroyed');
  }

  /**
   * Converts ingredients list to a search query embedding
   * Public method for use by other services (e.g., RecipesService)
   */
  public async getQueryEmbedding(query: string): Promise<number[]> {
    if (!this.embeddings) {
      throw new Error('Embeddings not initialized');
    }
    const embedding = await this.embeddings.embedQuery(query);
    return embedding;
  }

  /**
   * Searches for recipes similar to the ingredients query using vector similarity
   */
  private async searchSimilarRecipes(
    queryEmbedding: number[],
    limit: number = 5,
    similarityThreshold: number = RAG_SIMILARITY_THRESHOLD,
  ): Promise<RecipeRow[]> {
    const embeddingString = `[${queryEmbedding.join(',')}]`;

    const query = `
      SELECT 
        id,
        name,
        ingredients,
        instructions,
        1 - (embedding <=> $1::vector) AS similarity
      FROM recipes
      WHERE embedding IS NOT NULL
      ORDER BY embedding <=> $1::vector
      LIMIT $2
    `;

    try {
      const result = (await this.dataSource.query(query, [
        embeddingString,
        limit,
      ])) as unknown as RecipeRow[];

      const filtered = result.filter(
        (recipe: RecipeRow) =>
          (recipe.similarity as number) >= similarityThreshold,
      );

      return filtered;
    } catch (error) {
      this.logger.error('Error searching for recipes', error);
      if (error instanceof Error && error.message.includes('does not exist')) {
        this.logger.warn(
          'Recipes table does not exist. Returning empty results.',
        );
        return [];
      }
      throw error;
    }
  }

  /**
   * Generates recipe suggestions using LLM based on ingredients and similar recipes
   */
  private async generateSuggestions(
    ingredients: string,
    similarRecipes: RecipeRow[],
  ): Promise<object> {
    if (!this.llm) {
      throw new Error('LLM not initialized');
    }

    const recipeContext = similarRecipes
      .map(
        (recipe, index) => `
          Recipe ${index + 1}: ${recipe.name}
          Ingredients: ${recipe.ingredients}
          Instructions: ${recipe.instructions}
        `,
      )
      .join('\n---\n');

    const recipeContextText =
      similarRecipes.length > 0
        ? recipeContext
        : 'No similar recipes found in the database. Use your cooking knowledge to suggest dishes.';

    const fullPrompt = `
        You are a helpful Vietnamese cooking assistant AI.
        Your goal is to suggest realistic home-style Vietnamese dishes based on the user's available ingredients
        and optionally using related recipes from the database.
        
        ---
        
        User's ingredients:
        ${ingredients}
        
        Similar recipes from database:
        ${recipeContextText || '(none)'}
        
        ---
        
        TASK:
        1. First, check if the user's input is related to food, ingredients, cooking, or drinks.
          - If the input is **not related to cooking or ingredients** (for example, it's about weather, feelings, or other topics), 
            then respond with JSON:
            {
              "dishes": [],
              "error": {
                "code": "INVALID_INPUT",
                "message": "The input is not related to cooking or ingredients."
              }
            }
        2. Otherwise, continue normally:
          - Suggest 2-3 dishes the user can cook.
          - Each dish must be realistic, Vietnamese-style, and easy for home cooking.
          - If no recipes are found in the database, you may invent creative but reasonable dishes based on the ingredients.
        3. Only output valid JSON. Do not include any explanation, introduction, markdown, or text outside the JSON.
        
        ---
        
        OUTPUT FORMAT (strict JSON, no markdown, no explanation, no text outside the JSON):
        {
          "dishes": [
            {
              "name": "string",
              "description": "string",
              "usedIngredients": ["string", "string"],
              "extraIngredients": ["string", "string"],
              "steps": ["string", "string", "string"]
            }
          ]
        }
        
        Rules:
        - Always respond in Vietnamese.
        - Do NOT include introductions, summaries, or follow-up questions.
        - Do NOT include backticks, markdown code fences, or any explanation.
        - Begin output directly with '{' and end with '}'.
        - Each dish should have 3-5 clear steps.
        `;

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const response = await this.llm.invoke(fullPrompt);

      let text = '';
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (Array.isArray(response.content)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        text = response.content
          .map((contentPart: { text: string }) => contentPart.text ?? '')
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          .join('')
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          .trim();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      } else if (typeof response.content === 'string') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        text = response.content.trim();
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        text = String(response.content ?? '').trim();
      }

      // Parse JSON safely
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const json = JSON.parse(text);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return json;
      } catch {
        this.logger.warn(
          'Model did not return valid JSON, returning raw text.',
        );
        return {
          dishes: [],
        };
      }
    } catch (error) {
      this.logger.error('Error generating answer from LLM', error);
      throw error;
    }
  }

  /**
   * Main method to suggest recipes based on ingredients
   * @param ingredients - Comma-separated list of ingredients the user has (already validated by controller)
   * @returns AI-generated recipe suggestions with recipes and metadata
   */
  public async ask(ingredients: string): Promise<AskRecipeResponseDto> {
    const start = performance.now();
    const embeddingModel = RAG_EMBEDDING_MODEL;
    const llmModel = RAG_LLM_MODEL;

    try {
      this.logger.log(
        `Processing recipe request for ingredients: ${ingredients}`,
      );

      // Step 1: Create embedding for the ingredients query
      const queryEmbedding = await this.getQueryEmbedding(ingredients);

      // Step 2: Search for similar recipes in the database
      const similarRecipes = await this.searchSimilarRecipes(queryEmbedding);

      this.logger.log(
        `Found ${similarRecipes.length} similar recipes in database`,
      );

      // Step 3: Generate AI suggestions based on ingredients and similar recipes
      const suggestions = await this.generateSuggestions(
        ingredients,
        similarRecipes,
      );

      const recipes: RecipeDto[] = similarRecipes.map((recipe) => ({
        id: recipe.id,
        name: recipe.name,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
      }));

      return {
        status: 'success',
        query: ingredients,
        answer: suggestions as Record<string, never>,
        recipes,
        meta: {
          retrievedCount: similarRecipes.length,
          embeddingModel,
          llmModel,
          durationMs: performance.now() - start,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error: unknown) {
      this.logger.error('Error generating recipe suggestions', error);
      const durationMs = performance.now() - start;

      // Structured error handling
      const errorDetail: ErrorDetail = (() => {
        if (
          error instanceof Error &&
          (error.message.includes('ECONNREFUSED') ||
            error.message.includes('timeout') ||
            error.message.includes('connect'))
        ) {
          return {
            code: 'VECTOR_STORE_UNAVAILABLE',
            message: 'Cannot connect to vector store. Please try again later.',
          };
        }
        if (error instanceof Error) {
          return {
            code: 'RAG_SERVICE_ERROR',
            message: error.message,
          };
        }
        return {
          code: 'UNKNOWN_ERROR',
          message: 'Unknown error occurred',
        };
      })();

      return {
        status: 'error',
        query: ingredients,
        answer: null,
        error: errorDetail,
        meta: {
          retrievedCount: null,
          embeddingModel,
          llmModel,
          durationMs,
        },
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Gets the status of the RAG system
   * @returns { ready: boolean; count: number }
   * - ready: true if the RAG system is ready to answer questions
   * - count: number of recipes in the database
   */
  public async getStatus(): Promise<{ ready: boolean; count: number }> {
    const count = await this.recipeRepository.count();
    return {
      ready: count > 0,
      count,
    };
  }
}
