import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import useRecipes from '@/queries/recipes/recipes.queries';
import { AlertCircleIcon, PlusIcon } from 'lucide-react';
import RecipesTable from './recipes-table';
import { ProtectedLayoutHeader } from '@/layouts/protected-layout';
import { Button } from '@/components/ui/button';
import ProtectedLayoutContent from '@/layouts/protected-layout/protected-layout-content';
import TableSkeleton from '@/components/table-skeleton';

const Recipes = () => {
  const { data, isLoading, error } = useRecipes();

  if (error)
    return (
      <Alert variant="destructive">
        <AlertCircleIcon />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );

  return (
    <div>
      <ProtectedLayoutHeader title="Recipes">
        <Button variant="default" size="sm" disabled={isLoading}>
          <PlusIcon className="size-4" />
          Add recipe
        </Button>
      </ProtectedLayoutHeader>

      <ProtectedLayoutContent>
        {isLoading ? (
          <TableSkeleton columns={4} rows={10} />
        ) : (
          <RecipesTable
            data={data?.data ?? []}
            total={data?.total ?? 0}
            page={data?.page ?? 1}
            limit={data?.limit ?? 10}
            totalPages={data?.totalPages ?? 1}
          />
        )}
      </ProtectedLayoutContent>
    </div>
  );
};

export default Recipes;
