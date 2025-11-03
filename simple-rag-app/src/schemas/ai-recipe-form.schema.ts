import { z } from 'zod'

export const aiRecipeFormSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(100, 'Description must be at most 100 characters.'),
})

export type AIRecipeFormSchema = z.infer<typeof aiRecipeFormSchema>
