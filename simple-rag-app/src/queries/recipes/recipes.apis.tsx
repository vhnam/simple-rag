import type { RecipesRequest, RecipesResponse } from './recipes.types';
import { apiClient } from '@/lib/axios';

export const getRecipes = async (request: RecipesRequest) => {
  const response = await apiClient.get<RecipesResponse>('/recipes', {
    params: request,
  });
  return response.data;
};
