import axios from 'axios';
import { auth } from './auth';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api',
  timeout: 30000,
});

// Request interceptor — attach Bearer token
api.interceptors.request.use(
  (config) => {
    const token = auth.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor — handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      auth.removeToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

// ============================================================
// Auth API
// ============================================================
export const authApi = {
  register: (data: { full_name: string; email: string; password: string }) =>
    api.post('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),

  me: () => api.get('/auth/me'),
};

// ============================================================
// Files API
// ============================================================
export const filesApi = {
  list: (params?: {
    category?: string;
    type?: string;
    search?: string;
    page?: number;
    limit?: number;
    sort?: string;
  }) => api.get('/files', { params }),

  get: (id: string) => api.get(`/files/${id}`),

  upload: (formData: FormData) =>
    api.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  update: (id: string, data: Partial<{ title: string; description: string; category_id: string; is_published: boolean }>) =>
    api.patch(`/files/${id}`, data),

  delete: (id: string) => api.delete(`/files/${id}`),

  getDownloadUrl: (id: string) => api.get(`/files/${id}/download`),

  getStats: () => api.get('/files/stats'),
};

// ============================================================
// Categories API
// ============================================================
export const categoriesApi = {
  list: () => api.get('/categories'),

  create: (data: { name: string; slug: string; description?: string }) =>
    api.post('/categories', data),

  update: (id: string, data: { name?: string; slug?: string; description?: string }) =>
    api.patch(`/categories/${id}`, data),

  delete: (id: string) => api.delete(`/categories/${id}`),
};

// ============================================================
// Users API
// ============================================================
export const usersApi = {
  list: (params?: { page?: number; limit?: number }) =>
    api.get('/users', { params }),

  get: (id: string) => api.get(`/users/${id}`),

  update: (id: string, data: { full_name?: string; role?: string; avatar_url?: string }) =>
    api.patch(`/users/${id}`, data),

  delete: (id: string) => api.delete(`/users/${id}`),
};

export default api;
