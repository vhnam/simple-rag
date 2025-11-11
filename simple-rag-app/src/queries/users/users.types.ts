import { UserRole } from '../auth/auth.types';

export type User = {
  id: string;
  name: string;
  email: string;
  userRoles: Array<UserRole>;
  created_at: Date;
};

export type UserPreference = {
  id: string;
  user_id: string;
  interface_theme: 'light' | 'dark' | 'system';
  interface_language: 'en-US' | 'vi-VN';
  ai_language: 'en-US' | 'vi-VN';
  created_at: Date;
  updated_at: Date;
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

export type ProfileResponse = {
  user: User;
  preferences: UserPreference | null;
};

export type UpdateProfileRequest = {
  name?: string;
  email?: string;
  avatar?: string;
  interface_theme?: 'light' | 'dark' | 'system';
  interface_language?: 'en-US' | 'vi-VN';
  ai_language?: 'en-US' | 'vi-VN';
};

export type UpdateProfileResponse = {
  user: User;
  preferences: UserPreference;
};
