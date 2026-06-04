'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useFiles, useCategories } from '@/hooks/useFiles';
import FileCard from '@/components/files/FileCard';
import { Upload, ChevronRight, Loader2, Search } from 'lucide-react';

const FILE_TYPES = ['Semua', 'pdf', 'pptx', 'docx', 'xlsx'];

export default function FileRepoSection() {
  const [selectedType, setSelectedType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: filesData, isLoading } = useFiles({ 
    type: selectedType || undefined, 
    category: selectedCategory || undefined, 
    search: searchQuery || undefined,
    limit: 6 
  });
  const { data: categories } = useCategories();

  const files = filesData?.files ?? [];

  return (
    <section className="py-24 bg-[#060b18]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-3 block">Repositori File</span>
          <h2 className="section-title text-white mb-6">Materi <span className="gradient-text">Terbaru</span></h2>
          <div className="flex items-center justify-center gap-3">
            <Link href="/upload" className="btn-outline text-sm py-2 px-4">
              <Upload size={14} />
              Unggah
            </Link>
            <Link href="/materials" className="btn-primary text-sm py-2 px-4">
              <span className="flex items-center gap-1.5">Lihat Semua <ChevronRight size={14} /></span>
            </Link>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-8">
          {/* Filters (Left) */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              {FILE_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t === 'Semua' ? '' : t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    (t === 'Semua' && !selectedType) || selectedType === t
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {t === 'Semua' ? 'Semua Tipe' : `.${t}`}
                </button>
              ))}
            </div>
            {categories && categories.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap ml-2">
                <div className="w-px h-5 bg-slate-700 hidden sm:block" />
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${!selectedCategory ? 'bg-violet-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`}
                >
                  Semua Kategori
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${selectedCategory === cat.id ? 'bg-violet-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Bar (Right) */}
          <div className="relative w-full lg:w-64 xl:w-72">
            <input
              type="text"
              placeholder="Cari materi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0b1224] border border-slate-700/50 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden">
                <div className="skeleton h-48" />
              </div>
            ))}
          </div>
        ) : files.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <p className="text-lg font-medium">Belum ada materi tersedia</p>
            <p className="text-sm mt-2">Jadilah yang pertama mengunggah materi!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {files.map((file: import('@/types').PlatformFile, i: number) => (
              <div key={file.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 80}ms`, opacity: 0 }}>
                <FileCard file={file} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
