import { useQuery } from '@tanstack/react-query';
import { healthKeys } from './health.keys';
import { fetchHealthCheck } from './health.apis';

export const useHealthCheck = () => {
  return useQuery({
    queryKey: healthKeys.check(),
    queryFn: fetchHealthCheck,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 20000, // Consider data stale after 20 seconds
  });
};
