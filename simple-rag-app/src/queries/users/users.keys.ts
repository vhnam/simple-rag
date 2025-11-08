export const usersKeys = {
  all: ['users'] as const,
  list: (page: number, limit: number, search?: string) =>
    [...usersKeys.all, 'list', page, limit, search] as const,
  details: () => [...usersKeys.all, 'detail'] as const,
  detail: (id: string) => [...usersKeys.details(), id] as const,
};
