import { useQuery } from '@tanstack/react-query';

import { getRecipes } from './recipes.apis';
import { recipesKeys } from './recipes.keys';
import type { RecipesRequest } from './recipes.types';

export const useRecipes = (
  request: RecipesRequest = { page: 1, limit: 10 }
) => {
  return useQuery({
    queryKey: recipesKeys.list(request.page, request.limit, request.search),
    queryFn: () => getRecipes(request),
  });
};
