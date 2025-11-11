export const usersKeys = {
  all: ['users'] as const,
  list: (page: number, limit: number, search?: string) =>
    [...usersKeys.all, 'list', page, limit, search] as const,
  details: (id: string) => [...usersKeys.all, 'detail', id] as const,
  myProfile: () => [...usersKeys.all, 'profile', 'me'] as const,
};
