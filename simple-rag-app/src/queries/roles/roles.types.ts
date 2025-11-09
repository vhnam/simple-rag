export type Role = {
  id: string;
  name: string;
  description: string;
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

export type RoleDetailsSettingsFormSchema = {
  name: string;
  description: string;
};

export type UpdateRoleRequest = {
  id: string;
  data: RoleDetailsSettingsFormSchema;
};
