export const rolesKeys = {
  all: ['roles'] as const,
  list: (page: number, limit: number, search?: string) =>
    [...rolesKeys.all, 'list', page, limit, search] as const,
  details: () => [...rolesKeys.all, 'detail'] as const,
  detail: (id: string) => [...rolesKeys.details(), id] as const,
};
