// ============================================================
// Global Types for Kepemimpinan Platform
// ============================================================

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'user' | 'admin';
  avatar_url?: string;
  created_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at?: string;
}

export type FileType = 'pdf' | 'docx' | 'pptx' | 'xlsx' | 'jpg' | 'jpeg' | 'png' | 'gif' | 'mp4' | 'webm';

export interface PlatformFile {
  id: string;
  title: string;
  description?: string;
  file_type: FileType;
  file_url: string;
  storage_path: string;
  file_size?: number;
  category_id?: string;
  uploaded_by?: string;
  is_published: boolean;
  download_count: number;
  created_at: string;
  updated_at?: string;
  categories?: Category;
  profiles?: { id: string; full_name: string };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface FileStats {
  totalFiles: number;
  totalDownloads: number;
  totalViews: number;
  totalUsers: number;
  byType: Record<string, number>;
}

export interface FilesQuery {
  category?: string;
  type?: string;
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

export interface FilesListResponse {
  files: PlatformFile[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UsersListResponse {
  users: (User & { email: string })[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
}
