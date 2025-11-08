export type Role = {
  id: string;
  name: string;
  description: string | null;
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
