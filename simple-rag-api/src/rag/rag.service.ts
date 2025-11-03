import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  OnApplicationBootstrap,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { OpenAIEmbeddings } from '@langchain/openai';
import { ChatOpenAI } from '@langchain/openai';

interface Recipe {
  id: string; // UUID
  name: string;
  ingredients: string;
  instructions: string;
}

@Injectable()
export class RagService
  implements OnModuleInit, OnApplicationBootstrap, OnModuleDestroy
{
  private readonly logger = new Logger(RagService.name);
  private pool: Pool | null = null;
  private embeddings: OpenAIEmbeddings | null = null;
  private llm: ChatOpenAI | null = null;

  constructor(private configService: ConfigService) {}

  onModuleInit(): void {
    const dbHost = this.configService.get<string>('DB_HOST');
    const dbUser = this.configService.get<string>('DB_USER');
    const dbPassword = this.configService.get<string>('DB_PASSWORD');
    const dbName = this.configService.get<string>('DB_NAME');
    const dbPort = this.configService.get<string>('DB_PORT');
    const openAiApiKey = this.configService.get<string>('OPENAI_API_KEY');

    if (!dbHost || !dbUser || !dbPassword || !dbName || !dbPort) {
      throw new Error(
        'One or more required PostgreSQL environment variables are missing.',
      );
    }

    if (!openAiApiKey) {
      throw new Error('OPENAI_API_KEY environment variable is missing.');
    }

    const poolConfig = {
      host: dbHost,
      user: dbUser,
      password: dbPassword,
      database: dbName,
      port: Number.parseInt(dbPort, 10),
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    };

    this.pool = new Pool(poolConfig);

    this.pool.on('error', (err: Error) => {
      this.logger.error('Unexpected error on idle client', err);
    });

    // Initialize OpenAI embeddings and LLM
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: openAiApiKey,
    });

    this.llm = new ChatOpenAI({
      openAIApiKey: openAiApiKey,
      modelName: 'gpt-5-nano',
      temperature: 1,
    });
  }

  /**
   * Called after all modules have been initialized
   * This ensures the database schema is created before the app accepts requests
   */
  async onApplicationBootstrap(): Promise<void> {
    try {
      await this.initializeDatabase();
      this.logger.log('RAG service fully initialized');
    } catch (error) {
      this.logger.error('Failed to initialize database schema', error);
      // Don't throw - allow app to start even if migration fails
      // The error is logged and will be caught on first query attempt
    }
  }

  /**
   * Migrates the recipes table from SERIAL to UUID if needed
   */
  private async migrateToUUID(): Promise<void> {
    if (!this.pool) {
      throw new Error('Database pool not initialized');
    }

    try {
      // Check if table exists and get column type
      const tableCheck = await this.pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'recipes' AND column_name = 'id';
      `);

      // If table doesn't exist, skip migration (will be created with UUID)
      if (tableCheck.rows.length === 0) {
        this.logger.log(
          'Table does not exist, will be created with UUID schema',
        );
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const idColumnType = tableCheck.rows[0].data_type as string;

      // If already UUID, skip migration
      if (idColumnType === 'uuid') {
        this.logger.log('Table already uses UUID, skipping migration');
        return;
      }

      // If it's integer (SERIAL), migrate to UUID
      if (idColumnType === 'integer') {
        this.logger.log('Migrating recipes table from SERIAL to UUID...');

        // Check if there's existing data
        const countResult = await this.pool.query(
          'SELECT COUNT(*) FROM recipes',
        );
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const rowCount = parseInt(countResult.rows[0].count as string, 10);

        if (rowCount > 0) {
          this.logger.log(`Migrating ${rowCount} existing recipes to UUID...`);

          // Step 1: Add new UUID column
          await this.pool.query(`
            ALTER TABLE recipes 
            ADD COLUMN id_new UUID DEFAULT uuid_generate_v4();
          `);

          // Step 2: Populate UUID for existing rows (already has default, but ensure all have UUIDs)
          await this.pool.query(`
            UPDATE recipes 
            SET id_new = uuid_generate_v4() 
            WHERE id_new IS NULL;
          `);

          // Step 3: Drop old primary key constraint
          await this.pool.query(
            'ALTER TABLE recipes DROP CONSTRAINT recipes_pkey;',
          );

          // Step 4: Drop old id column
          await this.pool.query('ALTER TABLE recipes DROP COLUMN id;');

          // Step 5: Rename new column to id
          await this.pool.query(
            'ALTER TABLE recipes RENAME COLUMN id_new TO id;',
          );

          // Step 6: Add primary key constraint
          await this.pool.query('ALTER TABLE recipes ADD PRIMARY KEY (id);');

          this.logger.log(
            `Successfully migrated ${rowCount} recipes to UUID schema`,
          );
        } else {
          // No data, just recreate table with UUID
          this.logger.log(
            'No existing data, recreating table with UUID schema...',
          );
          await this.pool.query('DROP TABLE IF EXISTS recipes CASCADE;');
          await this.createRecipesTable();
        }
      }
    } catch (error) {
      this.logger.error('Error migrating to UUID schema', error);
      throw error;
    }
  }

  /**
   * Creates the recipes table with UUID schema
   */
  private async createRecipesTable(): Promise<void> {
    if (!this.pool) {
      throw new Error('Database pool not initialized');
    }

    await this.pool.query(`
      CREATE TABLE recipes (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        ingredients TEXT NOT NULL,
        instructions TEXT NOT NULL,
        embedding vector(1536),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }

  /**
   * Initializes the database schema (creates tables and indexes)
   */
  private async initializeDatabase(): Promise<void> {
    if (!this.pool) {
      throw new Error('Database pool not initialized');
    }

    try {
      // Enable pgvector extension
      await this.pool.query('CREATE EXTENSION IF NOT EXISTS vector;');

      // Enable uuid extension
      await this.pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

      // Migrate to UUID schema if needed
      await this.migrateToUUID();

      // Create recipes table if it doesn't exist
      const tableExists = await this.pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'recipes'
        );
      `);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (!(tableExists.rows[0].exists as boolean)) {
        await this.createRecipesTable();
        this.logger.log('Created recipes table with UUID schema');
      }

      // Create index for vector similarity search
      await this.pool
        .query(
          `
        CREATE INDEX IF NOT EXISTS recipes_embedding_idx ON recipes 
        USING ivfflat (embedding vector_cosine_ops)
        WITH (lists = 100);
      `,
        )
        .catch(() => {
          // Index might fail if table is empty, that's okay
          this.logger.warn(
            'Could not create vector index (table might be empty)',
          );
        });

      this.logger.log('Database schema initialized successfully');
    } catch (error) {
      this.logger.error('Error initializing database schema', error);
      throw error;
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.logger.log('Database connection pool closed');
    }
  }

  /**
   * Converts ingredients list to a search query embedding
   */
  private async getQueryEmbedding(query: string): Promise<number[]> {
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
  ): Promise<Recipe[]> {
    if (!this.pool) {
      throw new Error('Database pool not initialized');
    }

    // Convert embedding array to PostgreSQL vector format
    const embeddingString = `[${queryEmbedding.join(',')}]`;

    const query = `
      SELECT 
        id,
        name,
        ingredients,
        instructions,
        1 - (embedding <=> $1::vector) as similarity
      FROM recipes
      WHERE embedding IS NOT NULL
      ORDER BY embedding <=> $1::vector
      LIMIT $2
    `;

    try {
      const result = await this.pool.query(query, [embeddingString, limit]);
      return result.rows.map(
        (row: {
          id: string; // UUID
          name: string;
          ingredients: string;
          instructions: string;
        }) => ({
          id: row.id,
          name: row.name,
          ingredients: row.ingredients,
          instructions: row.instructions,
        }),
      );
    } catch (error) {
      this.logger.error('Error searching for recipes', error);
      // If the recipes table doesn't exist, return empty array
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
    similarRecipes: Recipe[],
  ): Promise<string> {
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

    const fullPrompt = `You are a helpful cooking assistant. Based on the ingredients the user has in their kitchen, suggest what they can cook.

User's ingredients: ${ingredients}

Here are some similar recipes from the database:
${recipeContextText}

Based on these recipes and the user's available ingredients, suggest 2-3 dishes they can cook. 
For each suggestion, provide:
1. The dish name
2. A brief description
3. List which ingredients from the user's list would be used
4. What additional ingredients (if any) might be needed
5. Basic cooking steps (3-5 steps)

Format your response in a clear, friendly way. If no similar recipes are found, still provide creative suggestions based on common cooking knowledge.`;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const response = await this.llm.invoke(fullPrompt);
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
  }

  /**
   * Main method to suggest recipes based on ingredients
   * @param ingredients - Comma-separated list of ingredients the user has (already validated by controller)
   * @returns AI-generated recipe suggestions
   */
  public async ask(ingredients: string): Promise<string> {
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

      return suggestions;
    } catch (error) {
      this.logger.error('Error generating recipe suggestions', error);
      throw error;
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
    if (!this.pool || !this.embeddings) {
      throw new Error('Database or embeddings not initialized');
    }

    try {
      // Generate embedding for the ingredients
      const embedding = await this.getQueryEmbedding(ingredients);
      const embeddingString = `[${embedding.join(',')}]`;

      // Insert recipe with embedding (UUID will be auto-generated by database)
      const result = await this.pool.query(
        `
        INSERT INTO recipes (name, ingredients, instructions, embedding)
        VALUES ($1, $2, $3, $4::vector)
        RETURNING id
      `,
        [name, ingredients, instructions, embeddingString],
      );

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const recipeId = result.rows[0].id as string;
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
  public async getAllRecipes(): Promise<Recipe[]> {
    if (!this.pool) {
      throw new Error('Database pool not initialized');
    }

    try {
      const result = await this.pool.query(
        'SELECT id, name, ingredients, instructions FROM recipes ORDER BY created_at DESC',
      );

      return result.rows.map(
        (row: {
          id: string; // UUID
          name: string;
          ingredients: string;
          instructions: string;
        }) => ({
          id: row.id,
          name: row.name,
          ingredients: row.ingredients,
          instructions: row.instructions,
        }),
      );
    } catch (error) {
      this.logger.error('Error fetching recipes', error);
      throw error;
    }
  }
}
