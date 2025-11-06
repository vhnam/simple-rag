export const healthKeys = {
  all: ['health'] as const,
  check: () => [...healthKeys.all, 'check'] as const,
  liveness: () => [...healthKeys.all, 'liveness'] as const,
  readiness: () => [...healthKeys.all, 'readiness'] as const,
};

export const ragKeys = {
  all: ['rag'] as const,
  status: () => [...ragKeys.all, 'status'] as const,
};
