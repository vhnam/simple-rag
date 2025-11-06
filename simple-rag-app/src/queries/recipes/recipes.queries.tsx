import { useQuery } from '@tanstack/react-query';
import { recipesKeys } from './recipes.keys';
import { getRecipes } from './recipes.apis';

const useRecipes = () => {
  return useQuery({
    queryKey: recipesKeys.list(),
    queryFn: () => getRecipes(),
  });
};

export default useRecipes;
