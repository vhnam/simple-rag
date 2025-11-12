import { AlertCircleIcon } from 'lucide-react';

import { PERMISSIONS } from '@/constants/permissions.constants';

import { useRoles } from '@/queries/roles';

import {
  ProtectedLayoutContent,
  ProtectedLayoutHeader,
} from '@/layouts/protected-layout';

import { Can } from '@/components/can';
import TableSkeleton from '@/components/table-skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { RoleCreateDialog } from '../role-create-dialog';
import RolesTable from './roles-table';

const RolesList = () => {
  const { data, isLoading, error } = useRoles();

  return (
    <div>
      <ProtectedLayoutHeader title="Roles">
        <Can permission={PERMISSIONS.ROLES_CREATE}>
          <RoleCreateDialog />
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
