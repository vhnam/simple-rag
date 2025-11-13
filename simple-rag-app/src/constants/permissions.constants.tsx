export const PERMISSIONS = {
  // User permissions
  USERS_VIEW_LIST: 'users:view_list',
  USERS_VIEW_DETAIL: 'users:view_detail',
  USERS_CREATE: 'users:create',
  USERS_UPDATE: 'users:update',
  USERS_DELETE: 'users:delete',

  // Role permissions
  ROLES_VIEW_LIST: 'roles:view_list',
  ROLES_VIEW_DETAIL: 'roles:view_detail',
  ROLES_CREATE: 'roles:create',
  ROLES_UPDATE: 'roles:update',
  ROLES_DELETE: 'roles:delete',

  PERMISSIONS_VIEW_LIST: 'permissions:view_list',
} as const;
