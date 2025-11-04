import type { AskRecipeResponse } from '@/queries/recipes/recipes.typings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface AIRecipeResultsProps {
  results: AskRecipeResponse;
}

const AIRecipeResults = ({ results }: AIRecipeResultsProps) => {
  return (
    <div className="space-y-6">
      <div>{results.answer}</div>
      {results.recipes.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Suggested Recipes</h2>
          <div className="space-y-6">
            {results.recipes.map((recipe) => (
              <Card key={recipe.id}>
                <CardHeader>
                  <CardTitle>{recipe.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium text-gray-500">Ingredients:</p>
                  <p>{recipe.ingredients}</p>
                  <Separator className="my-2" />
                  <p className="font-medium text-gray-500">Instructions:</p>
                  <p>{recipe.instructions}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIRecipeResults;
