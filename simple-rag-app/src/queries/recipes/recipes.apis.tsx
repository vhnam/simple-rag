import { apiClient } from '@/lib/axios';
import { type RecipesResponse } from './recipes.typings';

export const getRecipes = async () => {
  const response = await apiClient.get<RecipesResponse>('/rag/recipes');
  return response.data;
};
