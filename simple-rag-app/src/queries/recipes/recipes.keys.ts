export const recipesKeys = {
  all: ['recipes'] as const,
  list: (page: number, limit: number, search?: string) =>
    [...recipesKeys.all, 'list', page, limit, search] as const,
  details: () => [...recipesKeys.all, 'detail'] as const,
  detail: (id: string) => [...recipesKeys.details(), id] as const,
};
