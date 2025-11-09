export type Permission = {
  id: string;
  name: string;
  description: string;
};

export type GroupedPermission = {
  resource: string;
  permissions: Permission[];
};

export type PermissionsResponse = GroupedPermission[];
