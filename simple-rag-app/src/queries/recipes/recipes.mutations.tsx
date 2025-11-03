import { useMutation } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'

export const useCreateRecipeMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ingredients: string) =>
      fetch(`${import.meta.env.VITE_API_URL}/rag/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
    },
  })
}
