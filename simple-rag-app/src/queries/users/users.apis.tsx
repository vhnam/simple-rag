import type {
  ProfileResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  UsersRequest,
  UsersResponse,
} from './users.types';
import { apiClient } from '@/lib/axios';

export const getUsers = async (request: UsersRequest) => {
  const response = await apiClient.get<UsersResponse>('/users', {
    params: request,
  });
  return response.data;
};

export const getMyProfile = async () => {
  const response = await apiClient.get<ProfileResponse>('/users/me/profile');
  return response.data;
};

export const updateMyProfile = async (data: UpdateProfileRequest) => {
  const response = await apiClient.patch<UpdateProfileResponse>(
    '/users/me/profile',
    data
  );
  return response.data;
};
