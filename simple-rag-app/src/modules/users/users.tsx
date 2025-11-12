import { AlertCircleIcon } from 'lucide-react';

import { useUsers } from '@/queries/users';

import { ProtectedLayoutHeader } from '@/layouts/protected-layout';
import ProtectedLayoutContent from '@/layouts/protected-layout/protected-layout-content';

import TableSkeleton from '@/components/table-skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import UsersTable from './users-table';

const Users = () => {
  const { data, isLoading, error } = useUsers();

  return (
    <div>
      <ProtectedLayoutHeader title="Users" />

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
            <UsersTable
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

export default Users;
