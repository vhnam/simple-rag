import {
  RoleDetailsPermissionsFormSchema,
  RoleDetailsSettingsFormSchema,
} from '@/schemas/role-details-form.shema';
import { Permission } from '../permissions/permissions.types';
import { User } from '../users/users.types';

export type RolePermission = {
  id: string;
  permission: Permission;
  created_at: string;
  updated_at: string;
};

export type Role = {
  id: string;
  name: string;
  description: string;
  rolePermissions: Array<RolePermission>;
  created_at: string;
  updated_at: string;
};

export type RolesRequest = {
  page: number;
  limit: number;
  search?: string;
};

export type RolesResponse = {
  data: Array<Role>;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type UpdateRoleRequest = {
  id: string;
  data: RoleDetailsSettingsFormSchema | RoleDetailsPermissionsFormSchema;
};

export type RoleUsersRequest = {
  roleId: string;
  page: number;
  limit: number;
  search?: string;
};

export type RoleUsersResponse = {
  data: Array<User>;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type RemoveUserFromRoleRequest = {
  roleId: string;
  userId: string;
};