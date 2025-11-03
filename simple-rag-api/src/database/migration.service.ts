import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, QueryRunner } from 'typeorm';

@Injectable()
export class MigrationService implements OnModuleInit {
  private readonly logger = new Logger(MigrationService.name);

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async onModuleInit(): Promise<void> {
    try {
      await this.runMigrations();
      this.logger.log('Database migrations completed successfully');
    } catch (error) {
      this.logger.error('Failed to run database migrations', error);
      // Don't throw - allow app to start even if migration fails
      // The error is logged and will be caught on first query attempt
    }
  }

  private async runMigrations(): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      // Enable pgvector extension
      await queryRunner.query('CREATE EXTENSION IF NOT EXISTS vector;');

      // Enable uuid extension
      await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

      // Migrate to UUID schema if needed
      await this.migrateToUUID(queryRunner);

      // Create recipes table if it doesn't exist
      const tableExists = (await queryRunner.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'recipes'
        );
      `)) as Array<{ exists: boolean }>;

      if (!tableExists[0]?.exists) {
        await this.createRecipesTable(queryRunner);
        this.logger.log('Created recipes table with UUID schema');
      }

      // Create index for vector similarity search
      try {
        await queryRunner.query(`
          CREATE INDEX IF NOT EXISTS recipes_embedding_idx ON recipes 
          USING ivfflat (embedding vector_cosine_ops)
          WITH (lists = 100);
        `);
      } catch {
        // Index might fail if table is empty, that's okay
        this.logger.warn(
          'Could not create vector index (table might be empty)',
        );
      }

      // Create index for text search on ingredients (optional, for hybrid search)
      try {
        await queryRunner.query(`
          CREATE INDEX IF NOT EXISTS recipes_ingredients_idx ON recipes 
          USING gin(to_tsvector('english', ingredients));
        `);
      } catch {
        this.logger.warn('Could not create text search index');
      }

      this.logger.log('Database schema initialized successfully');
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Migrates the recipes table from SERIAL to UUID if needed
   */
  private async migrateToUUID(queryRunner: QueryRunner): Promise<void> {
    try {
      // Check if table exists and get column type
      const tableCheck = (await queryRunner.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'recipes' AND column_name = 'id';
      `)) as Array<{ column_name: string; data_type: string }>;

      // If table doesn't exist, skip migration (will be created with UUID)
      if (tableCheck.length === 0) {
        this.logger.log(
          'Table does not exist, will be created with UUID schema',
        );
        return;
      }

      const idColumnType = tableCheck[0].data_type;

      // If already UUID, skip migration
      if (idColumnType === 'uuid') {
        this.logger.log('Table already uses UUID, skipping migration');
        return;
      }

      // If it's integer (SERIAL), migrate to UUID
      if (idColumnType === 'integer') {
        this.logger.log('Migrating recipes table from SERIAL to UUID...');

        // Check if there's existing data
        const countResult = (await queryRunner.query(
          'SELECT COUNT(*) FROM recipes',
        )) as Array<{ count: string }>;
        const rowCount = parseInt(countResult[0].count, 10);

        if (rowCount > 0) {
          this.logger.log(`Migrating ${rowCount} existing recipes to UUID...`);

          // Step 1: Add new UUID column
          await queryRunner.query(`
            ALTER TABLE recipes 
            ADD COLUMN id_new UUID DEFAULT uuid_generate_v4();
          `);

          // Step 2: Populate UUID for existing rows
          await queryRunner.query(`
            UPDATE recipes 
            SET id_new = uuid_generate_v4() 
            WHERE id_new IS NULL;
          `);

          // Step 3: Drop old primary key constraint
          await queryRunner.query(
            'ALTER TABLE recipes DROP CONSTRAINT recipes_pkey;',
          );

          // Step 4: Drop old id column
          await queryRunner.query('ALTER TABLE recipes DROP COLUMN id;');

          // Step 5: Rename new column to id
          await queryRunner.query(
            'ALTER TABLE recipes RENAME COLUMN id_new TO id;',
          );

          // Step 6: Add primary key constraint
          await queryRunner.query('ALTER TABLE recipes ADD PRIMARY KEY (id);');

          this.logger.log(
            `Successfully migrated ${rowCount} recipes to UUID schema`,
          );
        } else {
          // No data, just recreate table with UUID
          this.logger.log(
            'No existing data, recreating table with UUID schema...',
          );
          await queryRunner.query('DROP TABLE IF EXISTS recipes CASCADE;');
          await this.createRecipesTable(queryRunner);
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
  private async createRecipesTable(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
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
}
