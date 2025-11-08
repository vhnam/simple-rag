export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: Date;
};

export type UsersRequest = {
  page: number;
  limit: number;
  search?: string;
};

export type UsersResponse = {
  data: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
