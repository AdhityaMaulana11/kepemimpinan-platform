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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-20">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">Semua <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-500">Materi</span></h1>
          <p className="text-slate-400 text-lg">Jelajahi dan unduh materi kepemimpinan terbaik</p>
        </div>

        {/* Search + Sort */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 max-w-4xl mx-auto">
          <div className="relative w-full">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              type="text"
              placeholder="Cari materi berdasarkan judul atau kata kunci..."
              className="w-full bg-[#0b1224] border border-white/[0.05] rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-lg"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full sm:w-auto min-w-[200px] bg-[#0b1224] border border-white/[0.05] rounded-2xl py-3.5 px-4 text-sm text-slate-300 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-lg cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} style={{ background: '#060b18' }}>Urutkan: {o.label}</option>
            ))}
          </select>
        </div>

        {/* Unified Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-14">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button onClick={() => { setType(''); setPage(1); }} className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${!type ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`}>
              Semua Tipe
            </button>
            {FILE_TYPES.map((t) => (
              <button key={t} onClick={() => { setType(t); setPage(1); }} className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${type === t ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`}>
                .{t}
              </button>
            ))}
          </div>

          {categories && categories.length > 0 && (
            <>
              <div className="w-px h-6 bg-slate-700 hidden lg:block mx-2" />
              <div className="flex flex-wrap items-center justify-center gap-2 mt-2 lg:mt-0">
                <button onClick={() => { setCategory(''); setPage(1); }} className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${!category ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`}>
                  Semua Kategori
                </button>
                {categories.map((cat) => (
                  <button key={cat.id} onClick={() => { setCategory(cat.id); setPage(1); }} className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${category === cat.id ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`}>
                    {cat.name}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Results count */}
        {/* <div className="flex items-center justify-between mb-6">
          <p className="text-sm font-medium text-slate-400">{data?.total ?? 0} <span className="text-slate-500">materi ditemukan</span></p>
        </div> */}

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
