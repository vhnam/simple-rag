import { AlertCircleIcon } from 'lucide-react';
import AIRecipeForm from './ai-recipe-form';
import useAIRecipeFormActions from './ai-recipe-form.actions';
import AIRecipeResults from './ai-recipe-results';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const AIRecipe = () => {
  const { form, isCreatingRecipe, recipeData, onReset } =
    useAIRecipeFormActions();

  return (
    <div className="mx-auto w-full max-w-2xl py-10">
      <AIRecipeForm
        form={form}
        isCreatingRecipe={isCreatingRecipe}
        onReset={onReset}
      />
      {!isCreatingRecipe && (
        <div className="mt-6 space-y-6">
          {recipeData && recipeData.status === 'success' && (
            <AIRecipeResults results={recipeData} />
          )}
          {recipeData?.answer.error?.code && (
            <Alert variant="destructive">
              <AlertCircleIcon />
              <AlertTitle>Unable to generate recipe</AlertTitle>
              <AlertDescription>
                {recipeData.answer.error.message}
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  );
};

export default AIRecipe;
