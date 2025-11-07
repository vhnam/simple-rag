import { apiClient } from '@/lib/axios';
import { RecipesRequest, RecipesResponse } from './recipes.typings';

export const getRecipes = async (request: RecipesRequest) => {
  const response = await apiClient.get<RecipesResponse>('/recipes', {
    params: request,
  });
  return response.data;
};
