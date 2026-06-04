'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthState } from '@/types';
import { auth } from '@/lib/auth';

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
        auth.removeToken(); // clears both localStorage AND the cookie
      },

      setUser: (user: User) => {
        set({ user });
      },
    }),
    {
      name: 'kp-auth-store',
      onRehydrateStorage: () => (state) => {
        // On page reload, restore token to both localStorage and cookie
        // so Axios interceptor and Next.js middleware can both read it
        if (state?.token && typeof window !== 'undefined') {
          auth.setToken(state.token);
        }
      },
    },
  ),
);
