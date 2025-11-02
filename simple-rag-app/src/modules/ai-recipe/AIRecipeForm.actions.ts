import { z } from 'zod'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'

const formSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(100, 'Description must be at most 100 characters.'),
})

const useAIRecipeFormActions = () => {
  const form = useForm({
    defaultValues: {
      category: '',
      description: '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: ({ value }) => {
      toast.success('You submitted the following values: ' + JSON.stringify(value))
    },
  })

  return {
    form,
  }
}

export default useAIRecipeFormActions
