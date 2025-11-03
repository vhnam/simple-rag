export type Recipe = {
  id: string;
  name: string;
  ingredients: string;
  instructions: string;
};

export type RecipeMeta = {
  retrievedCount: number;
  retrievalStatus: 'empty_index' | 'success' | 'error';
  embeddingModel: string;
  llmModel: string;
  durationMs: number;
};

export type RecipeStatus = 'no_data' | 'success' | 'error';

export type ErrorDetail = {
  code: 'VECTOR_STORE_UNAVAILABLE' | 'RAG_SERVICE_ERROR' | 'UNKNOWN_ERROR';
  message: string;
};

export type AskRecipeResponse = {
  status: RecipeStatus;
  query: string;
  answer: string | null;
  recipes: Recipe[];
  message?: string;
  meta?: RecipeMeta;
  timestamp?: string;
  error?: ErrorDetail;
};
