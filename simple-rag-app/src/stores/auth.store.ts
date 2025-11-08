import { SyncUserResponse } from '@/queries/auth/auth.types';
import { create, useStore } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const initialState: SyncUserResponse = {
  id: '',
  auth0Id: '',
  email: '',
  name: '',
  avatar: null,
  userRoles: [],
  created_at: '',
  updated_at: '',
  role: [],
  permissions: [],
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
