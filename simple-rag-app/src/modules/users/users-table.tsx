import { Link, redirect } from '@tanstack/react-router';
import type { ColumnDef } from '@tanstack/react-table';
import type { User } from '@/queries/users';
import DataTable from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/date';

interface UsersTableProps {
  data: Array<User>;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const columns: Array<ColumnDef<User>> = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    id: 'role',
    header: 'Role',
    cell: ({ row }) => (
      <span className="space-x-2">
        {row.original.userRoles.map((userRole) => (
          <Badge key={userRole.id}>{userRole.role.name}</Badge>
        ))}
      </span>
    ),
  },
  {
    id: 'created_at',
    header: 'Created At',
    cell: ({ row }) => <span>{formatDate(row.original.created_at)}</span>,
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Link
          to="/dashboard/users/$userId"
          params={{ userId: row.original.id }}
        >
          <Button variant="outline">View</Button>
        </Link>
      </div>
    ),
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
