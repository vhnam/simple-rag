import { useCreateRecipeMutation } from '@/queries/recipes';
import { AskRecipeResponse } from '@/queries/recipes/recipes.types';
import type { AIRecipeFormSchema } from '@/schemas/ai-recipe-form.schema';
import { aiRecipeFormSchema } from '@/schemas/ai-recipe-form.schema';
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import { toast } from 'sonner';

const defaultValues: AIRecipeFormSchema = {
  ingredients: '',
};

const useAIRecipeFormActions = () => {
  const [recipeData, setRecipeData] = useState<AskRecipeResponse>();

  const { mutate: createRecipe, isPending: isCreatingRecipe } =
    useCreateRecipeMutation();

  const handleSubmit = ({ value }: { value: AIRecipeFormSchema }) => {
    createRecipe(value.ingredients, {
      onSuccess: (data) => {
        setRecipeData(data);

        if (data.answer.error?.code === 'INVALID_INPUT') {
          toast.error(data.answer.error.message);
        } else if (data.status === 'success') {
          toast.success('Recipe generated successfully');
        } else {
          toast.error('Failed to generate recipe. Please try again.');
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

  const handleResetForm = () => {
    setRecipeData(undefined);
    form.reset();
  };

  return {
    form,
    isCreatingRecipe,
    recipeData,
    onReset: handleResetForm,
  };
};

export default useAIRecipeFormActions;
