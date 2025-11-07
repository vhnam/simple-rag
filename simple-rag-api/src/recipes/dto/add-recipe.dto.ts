import { z } from 'zod';

export const addRecipeSchema = z.object({
  name: z.string().min(1, 'Recipe name cannot be empty').trim(),
  ingredients: z.string().min(1, 'Ingredients cannot be empty').trim(),
  instructions: z.string().min(1, 'Instructions cannot be empty').trim(),
});

export const addRecipeResponseSchema = z.object({
  id: z.uuid('Invalid UUID format'),
  message: z.string(),
});

export type AddRecipeDto = z.infer<typeof addRecipeSchema>;
export type AddRecipeResponseDto = z.infer<typeof addRecipeResponseSchema>;

