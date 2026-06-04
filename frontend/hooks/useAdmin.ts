'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi, filesApi } from '@/lib/api';
import { toast } from 'sonner';

export function useAdminUsers(page = 1, limit = 10) {
  return useQuery({
    queryKey: ['admin-users', page, limit],
    queryFn: async () => {
      const res = await usersApi.list({ page, limit });
      return res.data.data;
    },
  });
}

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await filesApi.getStats();
      return res.data.data as import('@/types').FileStats;
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      usersApi.update(id, data as Parameters<typeof usersApi.update>[1]),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('Pengguna berhasil diperbarui');
    },
    onError: () => toast.error('Gagal memperbarui pengguna'),
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => usersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('Pengguna berhasil dihapus');
    },
    onError: () => toast.error('Gagal menghapus pengguna'),
  });
}
