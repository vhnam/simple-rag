import { AlertCircleIcon, PlusIcon } from 'lucide-react';

import { PERMISSIONS } from '@/constants/permissions.constants';

import { useRecipes } from '@/queries/recipes/recipes.queries';

import { ProtectedLayoutHeader } from '@/layouts/protected-layout';
import ProtectedLayoutContent from '@/layouts/protected-layout/protected-layout-content';

import { Can } from '@/components/can';
import TableSkeleton from '@/components/table-skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

import RecipesTable from './recipes-table';

const Recipes = () => {
  const { data, isLoading, error } = useRecipes();

  return (
    <div>
      <ProtectedLayoutHeader title="Recipes">
        <Can permission={PERMISSIONS.RECIPES_CREATE}>
          <Button variant="default" size="sm" disabled={isLoading}>
            <PlusIcon className="size-4" />
            Add recipe
          </Button>
        </Can>
      </ProtectedLayoutHeader>

      <ProtectedLayoutContent>
        {error && (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

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
