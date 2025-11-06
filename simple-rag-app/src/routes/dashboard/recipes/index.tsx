import { Recipes } from '@/modules/recipes';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/recipes/')({
  component: Recipes,
});
