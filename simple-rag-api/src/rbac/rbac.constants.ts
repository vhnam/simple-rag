/**
 * RBAC Constants
 * Central definition of roles and permissions used throughout the application
 */

export const ROLES = {
  ADMIN: 'admin',
  VIEWER: 'viewer',
} as const;

export const PERMISSIONS = {
  // Recipe permissions
  RECIPES_READ: 'recipes:read',
  RECIPES_CREATE: 'recipes:create',
  RECIPES_UPDATE: 'recipes:update',
  RECIPES_DELETE: 'recipes:delete',
  RECIPES_ALL: 'recipes:all',

  // User permissions
  USERS_READ: 'users:read',
  USERS_CREATE: 'users:create',
  USERS_UPDATE: 'users:update',
  USERS_DELETE: 'users:delete',
  USERS_ALL: 'users:all',
} as const;

export type RoleName = (typeof ROLES)[keyof typeof ROLES];
export type PermissionName = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

/**
 * Role definitions with descriptions
 */
export const ROLE_DEFINITIONS = [
  {
    name: ROLES.VIEWER,
    description: 'Can view recipes',
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
  // Recipe permissions
  {
    name: PERMISSIONS.RECIPES_READ,
    description: 'Can read recipes',
  },
  {
    name: PERMISSIONS.RECIPES_CREATE,
    description: 'Can create recipes',
  },
  {
    name: PERMISSIONS.RECIPES_UPDATE,
    description: 'Can update recipes',
  },
  {
    name: PERMISSIONS.RECIPES_DELETE,
    description: 'Can delete recipes',
  },
  {
    name: PERMISSIONS.RECIPES_ALL,
    description: 'Full access to all recipe operations',
  },

  // User permissions
  {
    name: PERMISSIONS.USERS_READ,
    description: 'Can read users',
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
  {
    name: PERMISSIONS.USERS_ALL,
    description: 'Full access to all user operations',
  },
] as const;

/**
 * Role-Permission mappings
 * Defines which permissions are assigned to each role
 */
export const ROLE_PERMISSIONS = {
  [ROLES.VIEWER]: [PERMISSIONS.RECIPES_READ, PERMISSIONS.USERS_READ],
  [ROLES.ADMIN]: [
    PERMISSIONS.RECIPES_READ,
    PERMISSIONS.RECIPES_CREATE,
    PERMISSIONS.RECIPES_UPDATE,
    PERMISSIONS.RECIPES_DELETE,
    PERMISSIONS.RECIPES_ALL,
    PERMISSIONS.USERS_READ,
    PERMISSIONS.USERS_CREATE,
    PERMISSIONS.USERS_UPDATE,
    PERMISSIONS.USERS_DELETE,
    PERMISSIONS.USERS_ALL,
  ],
} as const;
