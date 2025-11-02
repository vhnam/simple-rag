import { AIRecipe } from '@/modules/ai-recipe'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/ai-recipe')({
  component: AIRecipe,
})
