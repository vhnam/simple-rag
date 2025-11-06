import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import useRecipes from '@/queries/recipes/recipes.queries';
import { AlertCircleIcon } from 'lucide-react';

const Recipes = () => {
  const { data, isLoading, error } = useRecipes();

  if (isLoading) return <div>Loading...</div>;

  if (error)
    return (
      <Alert variant="destructive">
        <AlertCircleIcon />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );

    console.log(data);

  return (
    <div>
      <h1>Recipes</h1>

      {data?.recipes?.length === 0 && <div>No recipes found</div>}

      {data?.recipes && data?.recipes?.length > 0 &&
        data?.recipes?.map((recipe) => (
          <div key={recipe.id}>{recipe.name}</div>
        ))}
    </div>
  );
};

export default Recipes;
