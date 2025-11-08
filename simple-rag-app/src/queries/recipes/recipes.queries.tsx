import { useQuery } from '@tanstack/react-query';
import { recipesKeys } from './recipes.keys';
import { getRecipes } from './recipes.apis';
import { RecipesRequest } from './recipes.types';

const useRecipes = (request: RecipesRequest = { page: 1, limit: 10 }) => {
  return useQuery({
    queryKey: recipesKeys.list(request.page, request.limit, request.search),
    queryFn: () => getRecipes(request),
  });
};

export default useRecipes;
