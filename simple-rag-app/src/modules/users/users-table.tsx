import DataTable from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { User } from '@/queries/users/users.typings';
import { Link, redirect } from '@tanstack/react-router';
import { ColumnDef } from '@tanstack/react-table';

interface UsersTableProps {
  data: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
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
          to="/dashboard/users/$userId"
          params={{ userId: row.original.id }}
        >
          <Button variant="outline">View</Button>
        </Link>
      );
    },
  },
];

const UsersTable = ({ data, totalPages }: UsersTableProps) => {
  const handlePageChange = (page: number) => {
    redirect({
      href: `/dashboard/users?page=${page}`,
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

export default UsersTable;
