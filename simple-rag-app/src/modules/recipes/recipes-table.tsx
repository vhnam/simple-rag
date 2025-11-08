import DataTable from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Recipe } from '@/queries/recipes/recipes.types';
import { Link, redirect } from '@tanstack/react-router';
import { ColumnDef } from '@tanstack/react-table';

interface RecipesTableProps {
  data: Recipe[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const columns: ColumnDef<Recipe>[] = [
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
        <Link
          to="/dashboard/recipes/$recipeId"
          params={{ recipeId: row.original.id }}
        >
          <Button variant="outline">View</Button>
        </Link>
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
