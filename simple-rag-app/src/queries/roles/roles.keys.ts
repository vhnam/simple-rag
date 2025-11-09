export const rolesKeys = {
  all: ['roles'] as const,
  list: (page: number, limit: number, search?: string) =>
    [...rolesKeys.all, 'list', page, limit, search] as const,
  details: (id: string) => [...rolesKeys.all, 'details', id] as const,
  roleUsers: (roleId: string) =>
    [...rolesKeys.all, 'roleUsers', roleId] as const,
};
