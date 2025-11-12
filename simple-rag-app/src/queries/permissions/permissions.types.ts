export type Permission = {
  id: string;
  name: string;
  description: string;
};

export type GroupedPermission = {
  resource: string;
  permissions: Array<Permission>;
};

export type PermissionsResponse = Array<GroupedPermission>;
