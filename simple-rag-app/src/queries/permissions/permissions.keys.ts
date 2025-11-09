export const permissionsKeys = {
  all: ['permissions'] as const,
  list: () => [...permissionsKeys.all, 'list'] as const,
  grouped: () => [...permissionsKeys.all, 'grouped'] as const,
};
