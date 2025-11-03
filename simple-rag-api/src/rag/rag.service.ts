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
import { Recipe } from './entities/recipe.entity';
import {
  AskRecipeResponseDto,
  RecipeDto,
  ErrorDetail,
} from './dto/ask-recipe.dto';

interface RecipeRow {
  id: string;
  name: string;
  ingredients: string;
  instructions: string;
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
      modelName: 'gpt-5-nano',
      temperature: 1,
      maxTokens: 600,
    });
  }

  onModuleDestroy(): void {
    // TypeORM handles connection cleanup automatically
    this.logger.log('RAG service destroyed');
  }

  /**
   * Converts text to embedding vector
   */
  private async embedText(text: string): Promise<number[]> {
    if (!this.embeddings) {
      throw new Error('Embeddings not initialized');
    }
    const embedding = await this.embeddings.embedQuery(text);
    return embedding;
  }

  /**
   * Queries vector store for similar recipes using cosine distance
   * @param queryEmbedding - Embedding vector of the search query
   * @param limit - Maximum number of results to return
   * @returns Array of similar recipes
   */
  private async queryVectorStore(
    queryEmbedding: number[],
    limit: number = 5,
  ): Promise<RecipeRow[]> {
    // Convert embedding array to PostgreSQL vector format: "[1,2,3]"
    const embeddingString = `[${queryEmbedding.join(',')}]`;

    // Use cosine distance (<=>) operator for similarity search
    // Other operators available: <-> (L2/Euclidean), <#> (Inner product)
    const query = `
      SELECT 
        id,
        name,
        ingredients,
        instructions
      FROM recipes
      WHERE embedding IS NOT NULL
      AND (1 - (embedding <=> $1)) > 0.75 
      ORDER BY embedding <=> $1
      LIMIT $2
    `;

    try {
      this.logger.log(
        `Querying vector store with embedding dimension: ${queryEmbedding.length}`,
      );
      this.logger.log(`Executing SQL query: ${query.substring(0, 100)}...`);
      this.logger.log(
        `With parameters: embeddingString length=${embeddingString.length}, limit=${limit}`,
      );

      // TypeORM's query method returns any, cast to RecipeRow[] for type safety
      const result = (await this.dataSource.query(query, [
        embeddingString,
        limit,
      ])) as unknown as RecipeRow[];

      this.logger.log(
        `Vector store query completed, returned ${result.length} results`,
      );
      if (result.length > 0) {
        this.logger.log(`First result: ${result[0].name}`);
      }
      return result;
    } catch (error) {
      this.logger.error('Error querying vector store', error);

      // If the recipes table doesn't exist, return empty array
      if (error instanceof Error && error.message.includes('does not exist')) {
        this.logger.warn(
          'Recipes table does not exist. Returning empty results.',
        );
        return [];
      }

      // Re-throw error to be handled by ask() method
      throw error;
    }
  }

  /**
   * Generates answer using LLM with recipe context
   */
  private async generateAnswer(
    query: string,
    context: string,
  ): Promise<string> {
    if (!this.llm) {
      throw new Error('LLM not initialized');
    }

    const prompt = `
    You are a helpful cooking assistant.
    User asks: "${query}"
    
    Here are related recipes from the database:
    ${context}
    
    Based only on the provided recipes, suggest 1-2 dishes that best match the user's request.
    If no recipe fits, say: "I don't have a matching recipe yet."
    `;

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const response = await this.llm.invoke(prompt);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (response && typeof response.content === 'string') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
        return response.content;
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (response && response.content) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        return String(response.content);
      }
      throw new Error('Unexpected response format from LLM');
    } catch (error) {
      this.logger.error('Error generating answer from LLM', error);
      throw error;
    }
  }

  /**
   * Main RAG method to answer queries based on recipe database
   * @param query - User query about ingredients or recipes
   * @returns Standardized response with status, answer, recipes, and metadata
   */
  public async ask(query: string): Promise<AskRecipeResponseDto> {
    const start = performance.now();
    const embeddingModel = 'text-embedding-3-small';
    const llmModel = 'gpt-5-nano';

    try {
      this.logger.log(`Processing RAG query: ${query}`);

      // Step 1: Create embedding for the query
      this.logger.debug('Generating embedding for query...');
      const queryEmbedding = await this.embedText(query);
      this.logger.debug(
        `Embedding generated, dimension: ${queryEmbedding.length}`,
      );

      // Step 2: Query vector store for similar recipes
      this.logger.debug('Querying database vector store...');
      const results = await this.queryVectorStore(queryEmbedding, 5);
      const durationMs = performance.now() - start;
      this.logger.log(`Query took ${durationMs.toFixed(1)}ms`);
      this.logger.log(`Found ${results.length} similar recipes in database`);

      // Step 3: Handle empty results
      if (!results || results.length === 0) {
        this.logger.warn('No vector results — RAG index may be empty.');
        return {
          status: 'no_data',
          query,
          answer: null,
          recipes: [],
          message:
            'Currently the system does not have recipe data to suggest. Please add data first.',
          meta: {
            retrievedCount: 0,
            retrievalStatus: 'empty_index',
            embeddingModel,
            llmModel,
            durationMs,
          },
          timestamp: new Date().toISOString(),
        };
      }

      // Step 4: Build context from recipe metadata
      const context = results
        .map((recipe) => {
          return `Recipe: ${recipe.name}\nIngredients: ${recipe.ingredients}\nInstructions: ${recipe.instructions}`;
        })
        .join('\n\n');

      // Step 5: Generate answer using LLM with context
      const answer = await this.generateAnswer(query, context);

      const recipes: RecipeDto[] = results.map((recipe) => ({
        id: recipe.id,
        name: recipe.name,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
      }));

      return {
        status: 'success',
        query,
        answer,
        recipes,
        meta: {
          retrievedCount: results.length,
          embeddingModel,
          llmModel,
          durationMs: performance.now() - start,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error: unknown) {
      this.logger.error('Error in RAG query', error);

      const durationMs = performance.now() - start;
      const errorDetail: ErrorDetail = (() => {
        // Handle connection errors
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

      const errorResponse: AskRecipeResponseDto = {
        status: 'error',
        query,
        answer: null,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        error: errorDetail,
        meta: {
          retrievedCount: null,
          embeddingModel,
          llmModel,
          durationMs,
        },
        timestamp: new Date().toISOString(),
      };
      return errorResponse;
    }
  }

  /**
   * Adds a recipe to the database with automatic embedding generation
   * @param name - Recipe name (already validated by controller)
   * @param ingredients - List of ingredients (already validated by controller)
   * @param instructions - Cooking instructions (already validated by controller)
   * @returns The created recipe ID (UUID)
   */
  public async addRecipe(
    name: string,
    ingredients: string,
    instructions: string,
  ): Promise<string> {
    if (!this.embeddings) {
      throw new Error('Embeddings not initialized');
    }

    try {
      // Generate embedding for the ingredients
      const textForEmbedding = `${name}\nIngredients: ${ingredients}\nInstructions: ${instructions}`;
      const embedding = await this.embedText(textForEmbedding);
      // Convert to PostgreSQL vector format: "[1,2,3]"
      const embeddingString = `[${embedding.join(',')}]`;

      // Insert recipe with embedding using raw query for vector type
      // Cast to vector type explicitly for pgvector compatibility
      // TypeORM's query method returns any, cast to typed result for safety
      const result = (await this.dataSource.query(
        `
        INSERT INTO recipes (name, ingredients, instructions, embedding)
        VALUES ($1, $2, $3, $4::vector)
        RETURNING id
      `,
        [name, ingredients, instructions, embeddingString],
      )) as unknown as Array<{ id: string }>;

      const recipeId = result[0]?.id;
      if (!recipeId) {
        throw new Error('Failed to insert recipe: no ID returned');
      }
      this.logger.log(`Recipe "${name}" added with ID: ${recipeId}`);
      return recipeId;
    } catch (error) {
      this.logger.error('Error adding recipe', error);
      throw error;
    }
  }

  /**
   * Gets all recipes from the database
   */
  public async getAllRecipes(): Promise<RecipeRow[]> {
    try {
      const recipes = await this.recipeRepository.find({
        order: {
          created_at: 'DESC',
        },
        select: ['id', 'name', 'ingredients', 'instructions'],
      });

      return recipes.map((recipe) => ({
        id: recipe.id,
        name: recipe.name,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
      }));
    } catch (error) {
      this.logger.error('Error fetching recipes', error);
      throw error;
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
