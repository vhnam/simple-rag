import { useForm } from '@tanstack/react-form';
import { toast } from 'sonner';
import type { AIRecipeFormSchema } from '@/schemas/ai-recipe-form.schema';
import { useCreateRecipeMutation } from '@/queries/recipes';
import { aiRecipeFormSchema } from '@/schemas/ai-recipe-form.schema';

const defaultValues: AIRecipeFormSchema = {
  ingredients: '',
};

const useAIRecipeFormActions = () => {
  const {
    mutate: createRecipe,
    data: recipeData,
    isPending: isCreatingRecipe,
  } = useCreateRecipeMutation();

  const handleSubmit = ({ value }: { value: AIRecipeFormSchema }) => {
    createRecipe(value.ingredients, {
      onSuccess: ({ status }) => {
        if (status === 'success') {
          toast.success('Recipe generated successfully');
        } else {
          toast.error('Failed to generate recipe');
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: aiRecipeFormSchema,
    },
    onSubmit: handleSubmit,
  });

  return {
    form,
    isCreatingRecipe,
    recipeData,
  };
};

export default useAIRecipeFormActions;
