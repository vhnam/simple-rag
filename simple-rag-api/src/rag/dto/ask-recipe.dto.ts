import { z } from 'zod';

export const askRecipeSchema = z.object({
  ingredients: z.string().min(1, 'Ingredients cannot be empty').trim(),
});

export const recipeSchema = z.object({
  id: z.uuid('Invalid UUID format'),
  name: z.string(),
  ingredients: z.string(),
  instructions: z.string(),
});

export const recipeMetaSchema = z.object({
  retrievedCount: z.number().nullable().optional(),
  embeddingModel: z.string().optional(),
  llmModel: z.string().optional(),
  durationMs: z.number().optional(),
  retrievalStatus: z.string().optional(),
});

export const errorDetailSchema = z.object({
  code: z.string(),
  message: z.string(),
});

export const askRecipeResponseSchema = z.object({
  status: z.enum(['success', 'no_data', 'error']),
  query: z.string(),
  timestamp: z.string(),
  answer: z.object().nullable(),
  recipes: z.array(recipeSchema).optional(),
  message: z.string().optional(),
  meta: recipeMetaSchema.optional(),
  error: errorDetailSchema.optional(),
});

export type AskRecipeDto = z.infer<typeof askRecipeSchema>;
export type RecipeDto = z.infer<typeof recipeSchema>;
export type AskRecipeResponseDto = z.infer<typeof askRecipeResponseSchema>;
export type RecipeMeta = z.infer<typeof recipeMetaSchema>;
export type ErrorDetail = z.infer<typeof errorDetailSchema>;
