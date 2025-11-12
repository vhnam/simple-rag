import { Link, redirect } from '@tanstack/react-router';
import type { ColumnDef } from '@tanstack/react-table';
import type { Role } from '@/queries/roles';
import { Can } from '@/components/can';
import DataTable from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { PERMISSIONS } from '@/constants/permissions.constants';
import { formatDate } from '@/lib/date';

interface RolesTableProps {
  data: Array<Role>;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const columns: Array<ColumnDef<Role>> = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    id: 'updated_at',
    header: 'Updated At',
    cell: ({ row }) => <span>{formatDate(row.original.updated_at)}</span>,
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <Can permission={PERMISSIONS.ROLES_VIEW_DETAIL}>
        <div className="flex justify-end">
          <Link
            to="/dashboard/roles/$roleId"
            params={{ roleId: row.original.id }}
          >
            <Button variant="outline">View</Button>
          </Link>
        </div>
      </Can>
    ),
  },
];

const RolesTable = ({ data, totalPages }: RolesTableProps) => {
  const handlePageChange = (page: number) => {
    redirect({
      href: `/dashboard/roles?page=${page}`,
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

export default RolesTable;
