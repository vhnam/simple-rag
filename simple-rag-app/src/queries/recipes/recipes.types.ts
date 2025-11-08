export type Recipe = {
  id: string;
  name: string;
  ingredients: string;
  instructions: string;
};

export type RecipesRequest = {
  page: number;
  limit: number;
  search?: string;
};

export type RecipesResponse = {
  data: Recipe[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
