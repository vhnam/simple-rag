import type { Role } from '@/queries/roles/roles.types';

export interface SyncUserRequest {
  sub: string;
  email: string;
  name: string;
  picture: string | null;
  accessToken: string;
}

export type UserRole = {
  id: string;
  role: Role;
  created_at: string;
  updated_at: string;
};

export type SyncUserResponse = {
  id: string;
  auth0Id: string;
  email: string;
  name: string;
  avatar: string | null;
  role: Array<string>;
  userRoles: Array<UserRole>;
  permissions: Array<string>;
  created_at: string;
  updated_at: string;
};
