import { z } from 'zod';

// Zod schemas for validation
export const askRecipeSchema = z.object({
  ingredients: z.string().min(1, 'Ingredients cannot be empty').trim(),
});

export const addRecipeSchema = z.object({
  name: z.string().min(1, 'Recipe name cannot be empty').trim(),
  ingredients: z.string().min(1, 'Ingredients cannot be empty').trim(),
  instructions: z.string().min(1, 'Instructions cannot be empty').trim(),
});

export const recipeResponseSchema = z.object({
  answer: z.string(),
});

export const recipeSchema = z.object({
  id: z.string().uuid('Invalid UUID format'),
  name: z.string(),
  ingredients: z.string(),
  instructions: z.string(),
});

export const addRecipeResponseSchema = z.object({
  id: z.string().uuid('Invalid UUID format'),
  message: z.string(),
});

// TypeScript types inferred from Zod schemas
export type AskRecipeDto = z.infer<typeof askRecipeSchema>;
export type AddRecipeDto = z.infer<typeof addRecipeSchema>;
export type RecipeResponseDto = z.infer<typeof recipeResponseSchema>;
export type RecipeDto = z.infer<typeof recipeSchema>;
export type AddRecipeResponseDto = z.infer<typeof addRecipeResponseSchema>;
