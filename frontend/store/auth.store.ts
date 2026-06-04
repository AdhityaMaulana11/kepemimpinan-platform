'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthState } from '@/types';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoggedIn: false,

      setAuth: (user: User, token: string) => {
        set({ user, token, isLoggedIn: true });
      },

      logout: () => {
        set({ user: null, token: null, isLoggedIn: false });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('kp_access_token');
        }
      },

      setUser: (user: User) => {
        set({ user });
      },
    }),
    {
      name: 'kp-auth-store',
      onRehydrateStorage: () => (state) => {
        // Sync token to localStorage for Axios interceptor
        if (state?.token && typeof window !== 'undefined') {
          localStorage.setItem('kp_access_token', state.token);
        }
      },
    },
  ),
);
