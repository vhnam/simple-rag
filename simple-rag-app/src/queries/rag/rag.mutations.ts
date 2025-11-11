import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AskRecipeResponse } from './rag.types';
import { apiClient } from '@/lib/axios';

export const useAskRecipeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ingredients: string) =>
      apiClient
        .post<AskRecipeResponse>('/rag/ask', {
          ingredients,
        })
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
};
