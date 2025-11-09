import TableSkeleton from '@/components/table-skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ProtectedLayoutHeader } from '@/layouts/protected-layout';
import ProtectedLayoutContent from '@/layouts/protected-layout/protected-layout-content';
import { AlertCircleIcon, PlusIcon } from 'lucide-react';
import RolesTable from './roles-table';
import { useRoles } from '@/queries/roles';
import { Button } from '@/components/ui/button';

const RolesList = () => {
  const { data, isLoading, error } = useRoles();

  return (
    <div>
      <ProtectedLayoutHeader title="Roles">
        <Button variant="default" size="sm">
          <PlusIcon className="size-4" />
          Add role
        </Button>
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
          !error &&
          data && (
            <RolesTable
              data={data.data}
              total={data.total}
              page={data.page}
              limit={data.limit}
              totalPages={data.totalPages}
            />
          )
        )}
      </ProtectedLayoutContent>
    </div>
  );
};

export default RolesList;
