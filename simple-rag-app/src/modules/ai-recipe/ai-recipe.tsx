import AIRecipeForm from './ai-recipe-form'
import useAIRecipeFormActions from './ai-recipe-form.actions'
import AIRecipeResults from './ai-recipe-results'

const AIRecipe = () => {
  const { form, isCreatingRecipe } = useAIRecipeFormActions()

  return (
    <div className="w-full max-w-2xl mx-auto my-10">
      <AIRecipeForm form={form} isCreatingRecipe={isCreatingRecipe} />
      <AIRecipeResults />
    </div>
  )
}

export default AIRecipe
