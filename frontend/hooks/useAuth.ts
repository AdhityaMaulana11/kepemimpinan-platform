'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { authApi } from '@/lib/api';
import { auth } from '@/lib/auth';
import { toast } from 'sonner';

export function useAuth() {
  const router = useRouter();
  const { user, token, isLoggedIn, setAuth, logout, setUser } = useAuthStore();

  const login = async (email: string, password: string) => {
    const res = await authApi.login({ email, password });
    const { access_token, user: userData } = res.data.data;
    auth.setToken(access_token);
    setAuth(userData, access_token);
    toast.success(`Selamat datang, ${userData.full_name}!`);

    if (userData.role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
  };

  const register = async (full_name: string, email: string, password: string) => {
    const res = await authApi.register({ full_name, email, password });
    const { access_token, user: userData } = res.data.data;
    auth.setToken(access_token);
    setAuth(userData, access_token);
    toast.success('Akun berhasil dibuat!');
    router.push('/dashboard');
  };

  const logoutUser = () => {
    logout();
    router.push('/');
    toast.success('Berhasil keluar');
  };

  const refreshUser = async () => {
    try {
      const res = await authApi.me();
      setUser(res.data.data);
    } catch {
      logoutUser();
    }
  };

  return {
    user,
    token,
    isLoggedIn,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout: logoutUser,
    refreshUser,
  };
}
