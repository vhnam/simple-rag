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
  code: 'INVALID_INPUT' | 'UNKNOWN_ERROR';
  message: string;
};

export type Dish = {
  name: string;
  description: string;
  usedIngredients: Array<string>;
  extraIngredients: Array<string>;
  steps: Array<string>;
};

export type AskRecipeResponse = {
  answer: {
    dishes: Array<Dish>;
    error?: ErrorDetail;
  };
  query: string;
  status: RecipeStatus;
  meta?: RecipeMeta;
  timestamp?: string;
};
