-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Enable uuid extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create recipes table
CREATE TABLE IF NOT EXISTS recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  ingredients TEXT NOT NULL,
  instructions TEXT NOT NULL,
  embedding vector(1536), -- OpenAI embeddings are 1536 dimensions
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for vector similarity search
CREATE INDEX IF NOT EXISTS recipes_embedding_idx ON recipes 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Create index for text search on ingredients (optional, for hybrid search)
CREATE INDEX IF NOT EXISTS recipes_ingredients_idx ON recipes 
USING gin(to_tsvector('english', ingredients));

COMMENT ON TABLE recipes IS 'Recipe database with vector embeddings for semantic search';
COMMENT ON COLUMN recipes.embedding IS 'Vector embedding of recipe ingredients for similarity search';
