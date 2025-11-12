import { useQuery } from '@tanstack/react-query';

import { fetchHealthCheck } from './health.apis';
import { healthKeys } from './health.keys';

export const useHealthCheck = () => {
  return useQuery({
    queryKey: healthKeys.check(),
    queryFn: fetchHealthCheck,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 20000, // Consider data stale after 20 seconds
  });
};
