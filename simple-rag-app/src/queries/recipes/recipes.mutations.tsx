import { AskRecipeResponse } from './recipes.typings';
import { apiClient } from '@/lib/axios';
import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

export const useCreateRecipeMutation = () => {
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
