export const healthKeys = {
  all: ['health'] as const,
  check: () => [...healthKeys.all, 'check'] as const,
  liveness: () => [...healthKeys.all, 'liveness'] as const,
  readiness: () => [...healthKeys.all, 'readiness'] as const,
};
