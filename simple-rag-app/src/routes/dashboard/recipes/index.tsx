import { createFileRoute } from '@tanstack/react-router';

import { Recipes } from '@/modules/recipes';

export const Route = createFileRoute('/dashboard/recipes/')({
  component: Recipes,
});
