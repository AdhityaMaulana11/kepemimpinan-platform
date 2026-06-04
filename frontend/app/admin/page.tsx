'use client';

import { useAdminStats } from '@/hooks/useAdmin';
import { useFiles } from '@/hooks/useFiles';
import { FileText, Users, Eye, Download, TrendingUp, Loader2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminOverviewPage() {
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: filesData, isLoading: filesLoading } = useFiles({ limit: 5 });

  const statCards = [
    { label: 'Total File', value: stats?.totalFiles ?? 0, icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Total Pengguna', value: stats?.totalUsers ?? 0, icon: Users, color: 'text-violet-400', bg: 'bg-violet-500/10' },
    { label: 'Total Dilihat', value: stats?.totalViews ?? 0, icon: Eye, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Total Diunduh', value: stats?.totalDownloads ?? 0, icon: Download, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Overview</h1>
        <p className="text-slate-400 text-sm">Statistik platform secara keseluruhan</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="glass-card rounded-2xl p-5">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon size={20} className={color} />
              </div>
              <TrendingUp size={14} className="text-slate-600" />
            </div>
            {statsLoading ? (
              <div className="skeleton h-8 w-16 mb-1" />
            ) : (
              <p className="text-2xl font-bold text-white">{value.toLocaleString()}</p>
            )}
            <p className="text-xs text-slate-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent files */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5">
          <h2 className="text-sm font-semibold text-white">File Terbaru</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Judul</th>
                <th>Tipe</th>
                <th>Kategori</th>
                <th>Tanggal</th>
                <th>Unduhan</th>
              </tr>
            </thead>
            <tbody>
              {filesLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}><td colSpan={5}><div className="skeleton h-8 rounded" /></td></tr>
                ))
              ) : (filesData?.files ?? []).map((file: import('@/types').PlatformFile) => (
                <tr key={file.id}>
                  <td className="text-white font-medium">{file.title}</td>
                  <td><span className="badge bg-slate-700/50 text-slate-300 border-slate-600/30">.{file.file_type}</span></td>
                  <td className="text-slate-400">{(file.categories as { name?: string } | undefined)?.name ?? '—'}</td>
                  <td className="text-slate-400">{formatDate(file.created_at)}</td>
                  <td className="text-slate-400">{file.download_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
