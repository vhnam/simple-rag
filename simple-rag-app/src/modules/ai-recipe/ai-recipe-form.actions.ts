import { useForm } from '@tanstack/react-form'
import {
  type AIRecipeFormSchema,
  aiRecipeFormSchema,
} from '@/schemas/ai-recipe-form.schema'
import { useCreateRecipeMutation } from '@/queries/recipes'
import { toast } from 'sonner'

const defaultValues: AIRecipeFormSchema = {
  ingredients: '',
}

const useAIRecipeFormActions = () => {
  const { mutate: createRecipe, isPending: isCreatingRecipe } =
    useCreateRecipeMutation()

  const handleSubmit = ({ value }: { value: AIRecipeFormSchema }) => {
    createRecipe(value.ingredients, {
      onSuccess: () => {
        toast.success('Recipe generated successfully')
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })
  }

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: aiRecipeFormSchema,
    },
    onSubmit: handleSubmit,
  })

  return {
    form,
    isCreatingRecipe,
  }
}

export default useAIRecipeFormActions
