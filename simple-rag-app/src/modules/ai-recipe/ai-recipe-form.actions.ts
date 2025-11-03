import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import {
  type AIRecipeFormSchema,
  aiRecipeFormSchema,
} from '@/schemas/ai-recipe-form.schema'

const defaultValues: AIRecipeFormSchema = {
  category: '',
  description: '',
}

const useAIRecipeFormActions = () => {
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: aiRecipeFormSchema,
    },
    onSubmit: ({ value }) => {
      toast.success(
        'You submitted the following values: ' + JSON.stringify(value),
      )
    },
  })

  return {
    form,
  }
}

export default useAIRecipeFormActions
