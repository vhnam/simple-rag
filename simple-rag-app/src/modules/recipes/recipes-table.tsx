import { Link, redirect } from '@tanstack/react-router';
import type { ColumnDef } from '@tanstack/react-table';
import type { Recipe } from '@/queries/recipes/recipes.types';
import { Can } from '@/components/can';
import DataTable from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { PERMISSIONS } from '@/constants/permissions.constants';

interface RecipesTableProps {
  data: Array<Recipe>;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const columns: Array<ColumnDef<Recipe>> = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'ingredients',
    header: 'Ingredients',
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => {
      return (
        <Can permission={PERMISSIONS.RECIPES_VIEW_DETAIL}>
          <Link
            to="/dashboard/recipes/$recipeId"
            params={{ recipeId: row.original.id }}
          >
            <Button variant="outline">View</Button>
          </Link>
        </Can>
      );
    },
  },
];

const RecipesTable = ({ data, totalPages }: RecipesTableProps) => {
  const handlePageChange = (page: number) => {
    redirect({
      href: `/dashboard/recipes?page=${page}`,
    });
  };

  return (
    <div>
      <DataTable
        data={data}
        columns={columns}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default RecipesTable;
