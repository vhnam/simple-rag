import DataTable from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { User } from '@/queries/users';
import { ColumnDef } from '@tanstack/react-table';
import { redirect } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import RoleDetailsAssignUserDialog from './role-details-assign-user-dialog';
import { useRoleDetailsUsersActions } from './role-details-users.actions';

interface RoleDetailsUsersProps {
  roleId: string;
  roleName: string;
  roleUsers: User[];
  totalPages: number;
}

const RoleDetailsUsers = ({
  roleId,
  roleName,
  roleUsers,
  totalPages,
}: RoleDetailsUsersProps) => {
  const { id } = useAuthStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { onRemoveUserFromRole, isRemovingUser, onAssignUsers } =
    useRoleDetailsUsersActions();

  const isDisabled = useMemo(() => {
    return roleName === 'admin' || isRemovingUser;
  }, [roleName, isRemovingUser]);

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
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex justify-end">
          <Button
            variant="destructive"
            type="button"
            size="sm"
            disabled={isDisabled || id === row.original.id}
            onClick={() =>
              onRemoveUserFromRole(roleId, row.original.id as string)
            }
          >
            Remove
          </Button>
        </div>
      ),
    },
  ];

  const handleAssignUsers = (userIds: string[]) => {
    onAssignUsers(roleId, userIds);
    setIsDialogOpen(false);
  };

  const handlePageChange = (page: number) => {
    redirect({
      href: `/dashboard/roles/${roleId}/users?page=${page}`,
    });
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          Users that have this role directly assigned.
        </p>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default" type="button">
              Add User
            </Button>
          </DialogTrigger>
          {isDialogOpen && (
            <RoleDetailsAssignUserDialog
              roleName={roleName}
              onAssignUsers={handleAssignUsers}
            />
          )}
        </Dialog>
      </div>

      <DataTable
        data={roleUsers}
        columns={columns}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default RoleDetailsUsers;
