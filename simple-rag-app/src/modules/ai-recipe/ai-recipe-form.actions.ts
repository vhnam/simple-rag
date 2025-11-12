import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import type { AskRecipeResponse } from '@/queries/rag/rag.types';
import type { AIRecipeFormSchema } from '@/schemas/ai-recipe-form.schema';
import { aiRecipeFormSchema } from '@/schemas/ai-recipe-form.schema';
import { useAskRecipeMutation } from '@/queries/rag';

const defaultValues: AIRecipeFormSchema = {
  ingredients: '',
};

const useAIRecipeFormActions = () => {
  const [recipeData, setRecipeData] = useState<AskRecipeResponse>();

  const { mutate: askRecipe, isPending: isCreatingRecipe } =
    useAskRecipeMutation();

  const handleSubmit = ({ value }: { value: AIRecipeFormSchema }) => {
    askRecipe(value.ingredients, {
      onSuccess: (data: AskRecipeResponse) => {
        setRecipeData(data);

        if (data.answer.error?.code === 'INVALID_INPUT') {
          toast.error(data.answer.error.message);
        } else if (data.status === 'success') {
          toast.success('Recipe generated successfully');
        } else {
          toast.error('Failed to generate recipe. Please try again.');
        }
      },
      onError: (error: unknown) => {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data.error?.message);
        } else {
          toast.error('An unknown error occurred. Please try again later.');
        }
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
