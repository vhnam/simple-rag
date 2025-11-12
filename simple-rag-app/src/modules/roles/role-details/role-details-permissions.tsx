import {  useMemo } from 'react';
import { useRoleDetailsPermissionsFormActions } from './role-details-permissions.actions';
import type {FormEvent} from 'react';
import type { GroupedPermission } from '@/queries/permissions/permissions.types';
import type {RolePermission} from '@/queries/roles/roles.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';
import { capitalize } from '@/lib/utils';

interface RoleDetailsPermissionsProps {
  roleId: string;
  roleName: string;
  rolePermissions: Array<RolePermission>;
  groupedPermissions: Array<GroupedPermission>;
}

const RoleDetailsPermissions = ({
  roleId,
  roleName,
  rolePermissions,
  groupedPermissions,
}: RoleDetailsPermissionsProps) => {
  const { form, isSubmitting } = useRoleDetailsPermissionsFormActions({
    data: rolePermissions,
    roleId,
  });

  const isDisabled = useMemo(
    () => roleName === 'admin' || isSubmitting,
    [roleName, isSubmitting]
  );

  const handleSelectAll = () => {
    const allPermissionIds = groupedPermissions.flatMap((group) =>
      group.permissions.map((permission) => permission.id)
    );
    form.setFieldValue('permissionIds', allPermissionIds);
  };

  const handleSelectNone = () => {
    form.setFieldValue('permissionIds', []);
  };

  const handleSelectReset = () => {
    form.resetField('permissionIds');
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4 flex items-center justify-between">
        <h2>Permissions</h2>
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground text-sm">Select:</span>
          <Button
            type="button"
            variant="ghost"
            onClick={handleSelectAll}
            disabled={isDisabled}
          >
            All
          </Button>
          <Separator orientation="vertical" className="!h-4" />
          <Button
            type="button"
            variant="ghost"
            onClick={handleSelectNone}
            disabled={isDisabled}
          >
            None
          </Button>
          <Separator orientation="vertical" className="!h-4" />
          <Button
            type="button"
            variant="ghost"
            onClick={handleSelectReset}
            disabled={isDisabled}
          >
            Reset
          </Button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-6">
        {groupedPermissions?.map((groupedPermission) => (
          <Card key={groupedPermission.resource}>
            <CardHeader>
              <CardTitle>{capitalize(groupedPermission.resource)}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form.Field name="permissionIds" mode="array">
                {(field) => (
                  <FieldGroup className="gap-4">
                    {groupedPermission.permissions.map((permission) => {
                      const isChecked = field.state.value.includes(
                        permission.id
                      );
                      return (
                        <Field
                          orientation="horizontal"
                          key={permission.id}
                          data-invalid={
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid
                          }
                        >
                          <Checkbox
                            id={permission.id}
                            name="permissionIds[]"
                            checked={isChecked}
                            disabled={isDisabled}
                            onCheckedChange={(checked: boolean) => {
                              if (checked) {
                                field.pushValue(permission.id);
                              } else {
                                field.setValue(
                                  field.state.value?.filter(
                                    (id) => id !== permission.id
                                  ) ?? []
                                );
                              }
                            }}
                          />
                          <FieldLabel htmlFor={permission.id}>
                            {permission.description}
                          </FieldLabel>
                        </Field>
                      );
                    })}
                  </FieldGroup>
                )}
              </form.Field>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isDisabled}>
          {isSubmitting && <Spinner />}
          Save
        </Button>
      </div>
    </form>
  );
};

export default RoleDetailsPermissions;
