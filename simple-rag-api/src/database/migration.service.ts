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

      // Create users table if it doesn't exist
      const usersTableExists = (await queryRunner.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'users'
        );
      `)) as Array<{ exists: boolean }>;

      if (!usersTableExists[0]?.exists) {
        await this.createUsersTable(queryRunner);
        this.logger.log('Created users table with UUID schema');
      } else {
        // Check if auth0Id column exists with wrong case and fix it
        await this.migrateAuth0IdColumn(queryRunner);
      }

      // Create RBAC tables
      await this.createRbacTables(queryRunner);

      // Create user_preferences table
      await this.createUserPreferencesTable(queryRunner);

      // Create instruments table
      await this.createInstrumentsTable(queryRunner);

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

  /**
   * Migrates auth0Id column to preserve case if needed
   */
  private async migrateAuth0IdColumn(queryRunner: QueryRunner): Promise<void> {
    try {
      // Check if column exists (case-insensitive check)
      const columnCheck = (await queryRunner.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND LOWER(column_name) = 'auth0id';
      `)) as Array<{ column_name: string }>;

      if (columnCheck.length === 0) {
        // Column doesn't exist, add it
        this.logger.log('Adding auth0Id column to users table...');
        await queryRunner.query(`
          ALTER TABLE users 
          ADD COLUMN "auth0Id" VARCHAR(255) NOT NULL UNIQUE;
        `);
        this.logger.log('Successfully added auth0Id column');
        return;
      }

      // Column exists, check if it needs to be renamed
      const existingColumnName = columnCheck[0].column_name;
      if (existingColumnName !== 'auth0Id') {
        this.logger.log(
          `Migrating ${existingColumnName} column to auth0Id (preserve case)...`,
        );
        // Rename the column to preserve case
        await queryRunner.query(`
          ALTER TABLE users 
          RENAME COLUMN "${existingColumnName}" TO "auth0Id";
        `);
        this.logger.log('Successfully migrated auth0id to auth0Id');
      }
    } catch (error) {
      this.logger.error('Error migrating auth0Id column', error);
      // Don't throw - allow app to continue
    }
  }

  /**
   * Creates the users table with UUID schema
   */
  private async createUsersTable(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "auth0Id" VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255),
        name VARCHAR(255) NOT NULL,
        avatar VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }

  /**
   * Creates all RBAC-related tables
   */
  private async createRbacTables(queryRunner: QueryRunner): Promise<void> {
    // Create roles table
    const rolesTableExists = (await queryRunner.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'roles'
      );
    `)) as Array<{ exists: boolean }>;

    if (!rolesTableExists[0]?.exists) {
      await queryRunner.query(`
        CREATE TABLE roles (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name VARCHAR(255) NOT NULL UNIQUE,
          description VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      this.logger.log('Created roles table');
    }

    // Create permissions table
    const permissionsTableExists = (await queryRunner.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'permissions'
      );
    `)) as Array<{ exists: boolean }>;

    if (!permissionsTableExists[0]?.exists) {
      await queryRunner.query(`
        CREATE TABLE permissions (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name VARCHAR(255) NOT NULL UNIQUE,
          description VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      this.logger.log('Created permissions table');
    }

    // Create role_permissions join table
    const rolePermissionsTableExists = (await queryRunner.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'role_permissions'
      );
    `)) as Array<{ exists: boolean }>;

    if (!rolePermissionsTableExists[0]?.exists) {
      await queryRunner.query(`
        CREATE TABLE role_permissions (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          role_id UUID NOT NULL,
          permission_id UUID NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
          FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
          UNIQUE(role_id, permission_id)
        );
      `);
      this.logger.log('Created role_permissions table');
    }

    // Create user_roles join table
    const userRolesTableExists = (await queryRunner.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'user_roles'
      );
    `)) as Array<{ exists: boolean }>;

    if (!userRolesTableExists[0]?.exists) {
      await queryRunner.query(`
        CREATE TABLE user_roles (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL,
          role_id UUID NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
          UNIQUE(user_id, role_id)
        );
      `);
      this.logger.log('Created user_roles table');
    }
  }

  /**
   * Creates the user_preferences table
   */
  private async createUserPreferencesTable(
    queryRunner: QueryRunner,
  ): Promise<void> {
    const userPreferencesTableExists = (await queryRunner.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'user_preferences'
      );
    `)) as Array<{ exists: boolean }>;

    if (!userPreferencesTableExists[0]?.exists) {
      await queryRunner.query(`
        CREATE TABLE user_preferences (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL UNIQUE,
          interface_theme VARCHAR(50) DEFAULT 'system',
          interface_language VARCHAR(10) DEFAULT 'en-US',
          ai_language VARCHAR(10) DEFAULT 'en-US',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
      `);
      this.logger.log('Created user_preferences table');
    }
  }

  /**
   * Creates the instruments table
   */
  private async createInstrumentsTable(
    queryRunner: QueryRunner,
  ): Promise<void> {
    const instrumentsTableExists = (await queryRunner.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'instruments'
      );
    `)) as Array<{ exists: boolean }>;

    if (!instrumentsTableExists[0]?.exists) {
      await queryRunner.query(`
        DO $$ BEGIN
          CREATE TYPE instrument_family_enum AS ENUM ('woodwind', 'brass');
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `);

      await queryRunner.query(`
        DO $$ BEGIN
          CREATE TYPE difficulty_level_enum AS ENUM ('beginner', 'intermediate', 'advanced');
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `);

      await queryRunner.query(`
        DO $$ BEGIN
          CREATE TYPE weight_category_enum AS ENUM ('light', 'medium', 'heavy');
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `);

      await queryRunner.query(`
        DO $$ BEGIN
          CREATE TYPE volume_profile_enum AS ENUM ('soft', 'medium', 'loud');
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `);

      await queryRunner.query(`
        DO $$ BEGIN
          CREATE TYPE airflow_requirement_enum AS ENUM ('low', 'medium', 'high');
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `);

      await queryRunner.query(`
        DO $$ BEGIN
          CREATE TYPE embouchure_difficulty_enum AS ENUM ('easy', 'medium', 'hard');
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `);

      // Create instruments table
      await queryRunner.query(`
        CREATE TABLE instruments (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name VARCHAR(255) NOT NULL,
          instrument_family instrument_family_enum NOT NULL,
          difficulty_level difficulty_level_enum NOT NULL,
          weight_category weight_category_enum NOT NULL,
          volume_profile volume_profile_enum NOT NULL,
          airflow_requirement airflow_requirement_enum NOT NULL,
          embouchure_difficulty embouchure_difficulty_enum NOT NULL,
          typical_price_min INTEGER NOT NULL,
          typical_price_max INTEGER NOT NULL,
          description TEXT,
          recommended_beginners BOOLEAN DEFAULT false,
          embedding vector(1536),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Create index for vector similarity search
      try {
        await queryRunner.query(`
          CREATE INDEX IF NOT EXISTS instruments_embedding_idx ON instruments 
          USING ivfflat (embedding vector_cosine_ops)
          WITH (lists = 100);
        `);
      } catch {
        // Index might fail if table is empty, that's okay
        this.logger.warn(
          'Could not create vector index for instruments (table might be empty)',
        );
      }

      // Create index for beginner recommendations
      await queryRunner.query(`
        CREATE INDEX IF NOT EXISTS instruments_recommended_beginners_idx 
        ON instruments (recommended_beginners) 
        WHERE recommended_beginners = true;
      `);

      // Create index for difficulty level
      await queryRunner.query(`
        CREATE INDEX IF NOT EXISTS instruments_difficulty_level_idx 
        ON instruments (difficulty_level);
      `);

      this.logger.log('Created instruments table');
    }
  }
}
