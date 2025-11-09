import { Button } from '@/components/ui/button';
import { ProtectedLayoutHeader } from '@/layouts/protected-layout';
import ProtectedLayoutContent from '@/layouts/protected-layout/protected-layout-content';
import { useRole } from '@/queries/roles';
import { useParams } from '@tanstack/react-router';
import { ArrowLeftIcon } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RoleDetailsSettings from './role-details-settings';
import RoleDetailsPermissions from './role-details-permissions';
import RoleDetailsUsers from './role-details-users';

const RoleDetails = () => {
  const { roleId } = useParams({ from: '/dashboard/roles/$roleId' });
  const { data, isLoading, error } = useRole(roleId);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No data</div>;

  return (
    <div>
      <ProtectedLayoutHeader title="Role Details" />

      <ProtectedLayoutContent>
        <div className="mx-auto w-full max-w-5xl">
          <div className="mb-12 flex flex-col gap-4">
            <Link to="/dashboard/roles">
              <Button variant="ghost" size="sm">
                <ArrowLeftIcon className="size-4" />
                <span className="text-sm font-normal">Back to Roles</span>
              </Button>
            </Link>
            <h1 className="text-3xl font-medium">{data.name}</h1>
          </div>

          <Tabs defaultValue="settings">
            <TabsList className="mb-12">
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
            </TabsList>
            <TabsContent value="settings">
              <RoleDetailsSettings
                data={{
                  name: data.name,
                  description: data.description,
                }}
              />
            </TabsContent>
            <TabsContent value="permissions">
              <RoleDetailsPermissions />
            </TabsContent>
            <TabsContent value="users">
              <RoleDetailsUsers />
            </TabsContent>
          </Tabs>
        </div>
      </ProtectedLayoutContent>
    </div>
  );
};

export default RoleDetails;
