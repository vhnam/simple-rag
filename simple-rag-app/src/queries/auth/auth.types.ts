export interface SyncUserRequest {
  sub: string;
  email: string;
  name: string;
  picture: string | null;
  accessToken: string;
}

export type UserRole = {
  id: string;
  role: {
    id: string;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
  };
  created_at: string;
  updated_at: string;
};

export type SyncUserResponse = {
  id: string;
  auth0Id: string;
  email: string;
  name: string;
  avatar: string | null;
  userRoles: Array<UserRole>;
  created_at: string;
  updated_at: string;
  role: Array<string>;
  permissions: Array<string>;
};
