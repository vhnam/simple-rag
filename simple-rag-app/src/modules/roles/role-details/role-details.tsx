import { Button } from '@/components/ui/button';
import { ProtectedLayoutHeader } from '@/layouts/protected-layout';
import ProtectedLayoutContent from '@/layouts/protected-layout/protected-layout-content';
import { useRole, useRoleUsers } from '@/queries/roles';
import { useParams } from '@tanstack/react-router';
import { ArrowLeftIcon } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RoleDetailsSettings from './role-details-settings';
import RoleDetailsPermissions from './role-details-permissions';
import RoleDetailsUsers from './role-details-users';
import { usePermissions } from '@/queries/permissions';

const RoleDetails = () => {
  const { roleId } = useParams({ from: '/dashboard/roles/$roleId' });
  const {
    data: roleData,
    isLoading: isRoleLoading,
    error: roleError,
  } = useRole(roleId);
  const {
    data: groupedPermissionsData,
    isLoading: isGroupedPermissionsLoading,
    error: groupedPermissionsError,
  } = usePermissions();
  const {
    data: roleUsersData,
    isLoading: isRoleUsersLoading,
    error: roleUsersError,
  } = useRoleUsers({ roleId, page: 1, limit: 10, search: undefined });

  if (isRoleLoading || isGroupedPermissionsLoading || isRoleUsersLoading)
    return <div>Loading...</div>;
  if (roleError || groupedPermissionsError || roleUsersError)
    return (
      <div>
        Error:{' '}
        {roleError?.message ||
          groupedPermissionsError?.message ||
          roleUsersError?.message}
      </div>
    );
  if (!roleData || !groupedPermissionsData || !roleUsersData)
    return <div>No data</div>;

  return (
    <div>
      <ProtectedLayoutHeader title="Role Details" />

      <ProtectedLayoutContent>
        <div className="mx-auto w-full max-w-5xl pb-10">
          <div className="mb-12 flex flex-col gap-4">
            <Link to="/dashboard/roles">
              <Button variant="ghost" size="sm">
                <ArrowLeftIcon className="size-4" />
                <span className="text-sm font-normal">Back to Roles</span>
              </Button>
            </Link>
            <h1 className="text-3xl font-medium">{roleData.name}</h1>
          </div>

          <Tabs defaultValue="settings">
            <TabsList className="mb-12">
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
            </TabsList>
            <TabsContent value="settings">
              <RoleDetailsSettings
                roleId={roleId as string}
                data={{
                  name: roleData.name,
                  description: roleData.description,
                }}
              />
            </TabsContent>
            <TabsContent value="permissions">
              <RoleDetailsPermissions
                roleId={roleId as string}
                roleName={roleData.name}
                rolePermissions={roleData.rolePermissions}
                groupedPermissions={groupedPermissionsData}
              />
            </TabsContent>
            <TabsContent value="users">
              <RoleDetailsUsers
                roleId={roleId as string}
                roleName={roleData.name}
                roleUsers={roleUsersData.data}
                totalPages={roleUsersData.totalPages}
              />
            </TabsContent>
          </Tabs>
        </div>
      </ProtectedLayoutContent>
    </div>
  );
};

export default RoleDetails;
