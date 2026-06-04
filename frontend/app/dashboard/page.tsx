'use client';

import { useAuthStore } from '@/store/auth.store';
import { useFiles } from '@/hooks/useFiles';
import Navbar from '@/components/layout/Navbar';
import FileCard from '@/components/files/FileCard';
import Link from 'next/link';
import { Upload, FileText, LayoutDashboard } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data: filesData, isLoading } = useFiles({ limit: 6 });
  const files = filesData?.files ?? [];

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        {/* Welcome */}
        <div className="glass-card rounded-2xl p-8 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <LayoutDashboard size={18} className="text-blue-400" />
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest">Dashboard</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Selamat datang, {user?.full_name?.split(' ')[0]}! 👋</h1>
            <p className="text-slate-400 text-sm mt-1">Mulai belajar atau bagikan materi Anda</p>
          </div>
          <Link href="/upload" className="btn-primary whitespace-nowrap">
            <span className="flex items-center gap-2"><Upload size={16} /> Unggah Materi</span>
          </Link>
        </div>

        {/* Recent materials */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">Materi Terbaru</h2>
            <Link href="/materials" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">Lihat semua →</Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-48 rounded-2xl" />)}
            </div>
          ) : files.length === 0 ? (
            <div className="text-center py-16 glass-card rounded-2xl">
              <FileText size={40} className="text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">Belum ada materi. Jadilah yang pertama mengunggah!</p>
              <Link href="/upload" className="btn-primary mt-4 inline-flex">
                <span className="flex items-center gap-2"><Upload size={14} /> Unggah Sekarang</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {files.map((file: import('@/types').PlatformFile) => <FileCard key={file.id} file={file} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
