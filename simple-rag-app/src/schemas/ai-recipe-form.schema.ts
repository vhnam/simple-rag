import { z } from 'zod'

export const aiRecipeFormSchema = z.object({
  ingredients: z
    .string()
    .min(1, 'Ingredients are required')
    .max(100, 'Ingredients must be at most 100 characters.'),
})

export type AIRecipeFormSchema = z.infer<typeof aiRecipeFormSchema>
