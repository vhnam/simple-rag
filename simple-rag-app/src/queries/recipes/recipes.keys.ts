export const recipesKeys = {
  all: ['recipes'] as const,
  lists: () => [...recipesKeys.all, 'list'] as const,
  list: () => [...recipesKeys.lists()] as const,
  details: () => [...recipesKeys.all, 'detail'] as const,
  detail: (id: string) => [...recipesKeys.details(), id] as const,
};
