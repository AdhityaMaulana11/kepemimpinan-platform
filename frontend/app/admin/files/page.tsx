'use client';

import { useState } from 'react';
import { useFiles } from '@/hooks/useFiles';
import { useDeleteFile, useUpdateFile } from '@/hooks/useFiles';
import { formatDate, formatFileSize, getFileTypeColor } from '@/lib/utils';
import { Trash2, Pencil, Search, Plus, X, Loader2, Save } from 'lucide-react';
import Link from 'next/link';

export default function AdminFilesPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [editFile, setEditFile] = useState<null | { id: string; title: string; description?: string }>(null);
  const [editTitle, setEditTitle] = useState('');

  const { data, isLoading, refetch } = useFiles({ search, page, limit: 10 });
  const { mutate: deleteFile } = useDeleteFile();
  const { mutate: updateFile, isPending: updating } = useUpdateFile();

  const files = data?.files ?? [];
  const totalPages = data?.totalPages ?? 1;

  const openEdit = (f: { id: string; title: string; description?: string }) => { setEditFile(f); setEditTitle(f.title); };
  const saveEdit = () => {
    if (!editFile) return;
    updateFile({ id: editFile.id, data: { title: editTitle } }, { onSuccess: () => { setEditFile(null); refetch(); } });
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Manajemen File</h1>
          <p className="text-slate-400 text-sm">{data?.total ?? 0} file terdaftar</p>
        </div>
        <Link href="/upload" className="btn-primary text-sm py-2 px-4">
          <span className="flex items-center gap-1.5"><Plus size={14} /> Unggah File</span>
        </Link>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        {/* Search */}
        <div className="px-6 py-4 border-b border-white/5">
          <div className="relative max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} type="text" placeholder="Cari file..." className="input-field pl-8 py-2 text-sm" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr><th>Judul</th><th>Tipe</th><th>Ukuran</th><th>Tanggal</th><th>Unduhan</th><th>Aksi</th></tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => <tr key={i}><td colSpan={6}><div className="skeleton h-8 rounded" /></td></tr>)
              ) : files.length === 0 ? (
                <tr><td colSpan={6} className="text-center text-slate-500 py-12">Tidak ada file ditemukan</td></tr>
              ) : files.map((file: import('@/types').PlatformFile) => (
                <tr key={file.id}>
                  <td className="text-white font-medium max-w-xs truncate">{file.title}</td>
                  <td><span className={`badge ${getFileTypeColor(file.file_type)}`}>.{file.file_type}</span></td>
                  <td className="text-slate-400">{formatFileSize(file.file_size)}</td>
                  <td className="text-slate-400">{formatDate(file.created_at)}</td>
                  <td className="text-slate-400">{file.download_count}</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit({ id: file.id, title: file.title, description: file.description })} className="p-1.5 text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => confirm('Hapus file ini?') && deleteFile(file.id)} className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/5">
            <span className="text-xs text-slate-500">Halaman {page} dari {totalPages}</span>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 text-xs rounded-lg border border-white/10 text-slate-400 hover:text-white disabled:opacity-30 transition-all">← Prev</button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 text-xs rounded-lg border border-white/10 text-slate-400 hover:text-white disabled:opacity-30 transition-all">Next →</button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editFile && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card rounded-2xl p-6 w-full max-w-md animate-fade-in-up">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-white">Edit File</h3>
              <button onClick={() => setEditFile(null)} className="text-slate-500 hover:text-white transition-colors"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Judul</label>
                <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="input-field" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditFile(null)} className="btn-outline flex-1 justify-center py-2.5 text-sm">Batal</button>
              <button onClick={saveEdit} disabled={updating} className="btn-primary flex-1 justify-center py-2.5 text-sm">
                <span className="flex items-center gap-1.5">{updating ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Simpan</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
