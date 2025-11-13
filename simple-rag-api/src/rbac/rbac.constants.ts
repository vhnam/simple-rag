/**
 * RBAC Constants
 * Central definition of roles and permissions used throughout the application
 */

export const ROLES = {
  ADMIN: 'admin',
  VIEWER: 'viewer',
} as const;

export const PERMISSIONS = {
  // Instrument permissions
  INSTRUMENTS_VIEW_LIST: 'instruments:view_list',
  INSTRUMENTS_VIEW_DETAIL: 'instruments:view_detail',
  INSTRUMENTS_CREATE: 'instruments:create',
  INSTRUMENTS_UPDATE: 'instruments:update',
  INSTRUMENTS_DELETE: 'instruments:delete',

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

export type RoleName = (typeof ROLES)[keyof typeof ROLES];
export type PermissionName = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

/**
 * Role definitions with descriptions
 */
export const ROLE_DEFINITIONS = [
  {
    name: ROLES.VIEWER,
    description: 'Can view basic information',
  },
  {
    name: ROLES.ADMIN,
    description: 'Full access to all features',
  },
] as const;

/**
 * Permission definitions with descriptions
 * NOTE: These are only used for initial seeding.
 * New permissions are auto-discovered from @Permissions() decorators in controllers
 * by the PermissionSyncService
 */
export const PERMISSION_DEFINITIONS = [
  // Instrument permissions
  {
    name: PERMISSIONS.INSTRUMENTS_VIEW_LIST,
    description: 'Can view list of instruments',
  },
  {
    name: PERMISSIONS.INSTRUMENTS_VIEW_DETAIL,
    description: 'Can view details of an instrument',
  },
  {
    name: PERMISSIONS.INSTRUMENTS_CREATE,
    description: 'Can create instruments',
  },
  {
    name: PERMISSIONS.INSTRUMENTS_UPDATE,
    description: 'Can update instruments',
  },
  {
    name: PERMISSIONS.INSTRUMENTS_DELETE,
    description: 'Can delete instruments',
  },
  // User permissions
  {
    name: PERMISSIONS.USERS_VIEW_LIST,
    description: 'Can view list of users',
  },
  {
    name: PERMISSIONS.USERS_VIEW_DETAIL,
    description: 'Can view details of a user',
  },
  {
    name: PERMISSIONS.USERS_CREATE,
    description: 'Can create users',
  },
  {
    name: PERMISSIONS.USERS_UPDATE,
    description: 'Can update users',
  },
  {
    name: PERMISSIONS.USERS_DELETE,
    description: 'Can delete users',
  },

  // Role permissions
  {
    name: PERMISSIONS.ROLES_VIEW_LIST,
    description: 'Can view list of roles',
  },
  {
    name: PERMISSIONS.ROLES_VIEW_DETAIL,
    description: 'Can view details of a role',
  },
  {
    name: PERMISSIONS.ROLES_CREATE,
    description: 'Can create roles',
  },
  {
    name: PERMISSIONS.ROLES_UPDATE,
    description: 'Can update roles',
  },
  {
    name: PERMISSIONS.ROLES_DELETE,
    description: 'Can delete roles',
  },

  // Permission permissions
  {
    name: PERMISSIONS.PERMISSIONS_VIEW_LIST,
    description: 'Can view list of permissions',
  },
] as const;

/**
 * Role-Permission mappings
 * Defines which permissions are assigned to each role
 */
export const ROLE_PERMISSIONS = {
  [ROLES.VIEWER]: [],
  [ROLES.ADMIN]: [
    PERMISSIONS.USERS_VIEW_LIST,
    PERMISSIONS.USERS_VIEW_DETAIL,
    PERMISSIONS.USERS_CREATE,
    PERMISSIONS.USERS_UPDATE,
    PERMISSIONS.USERS_DELETE,
    PERMISSIONS.ROLES_VIEW_LIST,
    PERMISSIONS.ROLES_VIEW_DETAIL,
    PERMISSIONS.ROLES_CREATE,
    PERMISSIONS.ROLES_UPDATE,
    PERMISSIONS.ROLES_DELETE,
    PERMISSIONS.INSTRUMENTS_VIEW_LIST,
    PERMISSIONS.INSTRUMENTS_VIEW_DETAIL,
    PERMISSIONS.INSTRUMENTS_CREATE,
    PERMISSIONS.INSTRUMENTS_UPDATE,
    PERMISSIONS.INSTRUMENTS_DELETE,
    PERMISSIONS.PERMISSIONS_VIEW_LIST,
  ],
} as const;
