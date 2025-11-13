import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '@/lib/axios';

import type { AskInstrumentResponse } from './rag.types';
import type { InstrumentFormSchema } from '@/schemas/instrument-form.schema';

export const useRecommendInstrumentsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (preferences: InstrumentFormSchema) =>
      apiClient
        .post<AskInstrumentResponse>('/rag/ask', preferences)
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instruments'] });
    },
  });
};
