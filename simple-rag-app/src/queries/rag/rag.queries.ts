import { useQuery } from '@tanstack/react-query';

import { fetchRagStatus } from './rag.apis';
import { ragKeys } from './rag.keys';

export const useRagStatus = () => {
  return useQuery({
    queryKey: ragKeys.status(),
    queryFn: () => fetchRagStatus(),
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 20000, // Consider data stale after 20 seconds
  });
};
