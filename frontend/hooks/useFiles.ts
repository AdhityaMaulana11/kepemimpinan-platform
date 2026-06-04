'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { filesApi, categoriesApi } from '@/lib/api';
import { FilesQuery } from '@/types';
import { toast } from 'sonner';

export function useFiles(query: FilesQuery = {}) {
  return useQuery({
    queryKey: ['files', query],
    queryFn: async () => {
      const res = await filesApi.list(query);
      return res.data.data;
    },
    staleTime: 1000 * 30,
  });
}

export function useFile(id: string) {
  return useQuery({
    queryKey: ['file', id],
    queryFn: async () => {
      const res = await filesApi.get(id);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await categoriesApi.list();
      return res.data.data as import('@/types').Category[];
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useUploadFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => filesApi.upload(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      toast.success('File berhasil diunggah!');
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Gagal mengunggah file';
      toast.error(msg);
    },
  });
}

export function useDeleteFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => filesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      toast.success('File berhasil dihapus');
    },
    onError: () => toast.error('Gagal menghapus file'),
  });
}

export function useUpdateFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      filesApi.update(id, data as Parameters<typeof filesApi.update>[1]),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      toast.success('File berhasil diperbarui');
    },
    onError: () => toast.error('Gagal memperbarui file'),
  });
}
