import { createFileRoute } from '@tanstack/react-router';
import { AIRecipe } from '@/modules/ai-recipe';

export const Route = createFileRoute('/ai-recipe')({
  component: AIRecipe,
});
