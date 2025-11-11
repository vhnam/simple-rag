import { SyncUserResponse } from '@/queries/auth/auth.types';
import { create, useStore } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const initialState: SyncUserResponse = {
  id: '',
  auth0Id: '',
  email: '',
  name: '',
  avatar: null,
  role: [],
  userRoles: [],
  permissions: [],
  created_at: '',
  updated_at: '',
};

export interface AuthStore extends SyncUserResponse {
  setState: (state: SyncUserResponse) => void;
}

export const authStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,
      setState: (state) => set(state),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useAuthStore = () => {
  return useStore(authStore);
};
