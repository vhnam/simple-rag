import AIRecipeForm from './ai-recipe-form';
import useAIRecipeFormActions from './ai-recipe-form.actions';
import AIRecipeResults from './ai-recipe-results';

const AIRecipe = () => {
  const { form, isCreatingRecipe, recipeData } = useAIRecipeFormActions();

  return (
    <div className="mx-auto w-full max-w-2xl py-10">
      <AIRecipeForm form={form} isCreatingRecipe={isCreatingRecipe} />
      {recipeData && recipeData.status === 'success' && (
        <AIRecipeResults results={recipeData} />
      )}
    </div>
  );
};

export default AIRecipe;
