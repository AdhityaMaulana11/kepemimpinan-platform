'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FileCard from '@/components/files/FileCard';
import { useFiles, useCategories } from '@/hooks/useFiles';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';

const FILE_TYPES = ['pdf', 'pptx', 'docx', 'xlsx', 'jpg', 'png', 'mp4'];
const SORT_OPTIONS = [
  { value: 'created_at', label: 'Terbaru' },
  { value: 'download_count', label: 'Terpopuler' },
  { value: 'title', label: 'Nama A-Z' },
];

export default function MaterialsPage() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('created_at');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useFiles({ search, type, category, sort, page, limit: 12 });
  const { data: categories } = useCategories();

  const files = data?.files ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Semua Materi</h1>
          <p className="text-slate-400">Jelajahi dan unduh materi kepemimpinan terbaik</p>
        </div>

        {/* Search + Sort */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              type="text"
              placeholder="Cari materi..."
              className="input-field pl-10"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="input-field w-auto min-w-[160px] cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} style={{ background: '#111827' }}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Type filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button onClick={() => { setType(''); setPage(1); }} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${!type ? 'bg-blue-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`}>
            Semua Tipe
          </button>
          {FILE_TYPES.map((t) => (
            <button key={t} onClick={() => { setType(t); setPage(1); }} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${type === t ? 'bg-blue-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`}>
              .{t}
            </button>
          ))}
        </div>

        {/* Category filters */}
        {categories && categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <button onClick={() => { setCategory(''); setPage(1); }} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${!category ? 'bg-violet-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`}>
              Semua Kategori
            </button>
            {categories.map((cat) => (
              <button key={cat.id} onClick={() => { setCategory(cat.id); setPage(1); }} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${category === cat.id ? 'bg-violet-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`}>
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Results count */}
        <p className="text-xs text-slate-500 mb-6">{data?.total ?? 0} materi ditemukan</p>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton h-52 rounded-2xl" />)}
          </div>
        ) : files.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">📂</div>
            <p className="text-slate-400 font-medium">Tidak ada materi ditemukan</p>
            <p className="text-slate-600 text-sm mt-1">Coba ubah filter atau kata kunci pencarian</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {files.map((file: import('@/types').PlatformFile, i: number) => (
              <div key={file.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 50}ms`, opacity: 0 }}>
                <FileCard file={file} />
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 text-sm rounded-lg border border-white/10 text-slate-400 hover:border-blue-500/40 hover:text-white disabled:opacity-30 transition-all">
              ← Sebelumnya
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).slice(Math.max(0, page - 3), page + 2).map((p) => (
              <button key={p} onClick={() => setPage(p)} className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${p === page ? 'bg-blue-500 text-white' : 'border border-white/10 text-slate-400 hover:border-blue-500/40 hover:text-white'}`}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 text-sm rounded-lg border border-white/10 text-slate-400 hover:border-blue-500/40 hover:text-white disabled:opacity-30 transition-all">
              Selanjutnya →
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
