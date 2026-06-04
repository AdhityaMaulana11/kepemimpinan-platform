'use client';

import { useFile } from '@/hooks/useFiles';
import { formatFileSize, formatDate, getFileTypeColor, getFileTypeIcon, isImageFile, isVideoFile, isPdfFile, isOfficeFile } from '@/lib/utils';
import { filesApi } from '@/lib/api';
import Link from 'next/link';
import { ArrowLeft, Download, Presentation, Calendar, HardDrive, Eye, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function MaterialDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { data: file, isLoading } = useFile(id);

  const handleDownload = async () => {
    try {
      const res = await filesApi.getDownloadUrl(id);
      const { download_url } = res.data.data;
      
      const link = document.createElement('a');
      link.href = download_url;
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      toast.error('Gagal mengunduh file');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-blue-400" />
      </div>
    );
  }

  if (!file) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-slate-400 text-lg">File tidak ditemukan</p>
        <Link href="/materials" className="btn-outline text-sm">← Kembali ke Materi</Link>
      </div>
    );
  }

  const badgeClass = getFileTypeColor(file.file_type);
  const icon = getFileTypeIcon(file.file_type);

  return (
    <div className="min-h-screen bg-[#060b18] pt-32 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <Link 
          href="/materials" 
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 transition-all duration-300 mb-10 text-sm font-medium border border-blue-500/20 backdrop-blur-md"
        >
          <ArrowLeft size={16} /> Kembali ke Materi
        </Link>

        {/* Header card */}
        <div className="rounded-[2rem] bg-white/[0.02] border border-white/[0.05] p-8 sm:p-12 mb-8 shadow-[0_0_40px_-15px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 mb-10 text-center sm:text-left">
            <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/[0.05] shadow-inner">
              <span className="text-6xl">{icon}</span>
            </div>
            <div className="flex-1 pt-2">
              <span className={`badge ${badgeClass} mb-4 px-3 py-1 text-xs font-bold tracking-wider rounded-lg`}>.{file.file_type}</span>
              <h1 className="text-3xl font-bold text-white leading-tight tracking-tight mb-3">{file.title}</h1>
              {file.description && <p className="text-slate-400 text-sm sm:text-base leading-relaxed">{file.description}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5 pt-8 border-t border-white/[0.05]">
            {[
              { icon: Calendar, label: 'Tanggal', value: formatDate(file.created_at) },
              { icon: HardDrive, label: 'Ukuran', value: formatFileSize(file.file_size) },
              { icon: Eye, label: 'Dilihat', value: `${file.download_count ?? 0}x` },
              { icon: Download, label: 'Diunduh', value: `${file.download_count ?? 0}x` },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="text-center p-4 bg-white/[0.02] border border-white/[0.03] rounded-2xl hover:bg-white/[0.05] transition-colors duration-300">
                <Icon size={18} className="text-blue-400 mx-auto mb-2 opacity-80" />
                <p className="text-[11px] font-semibold text-slate-500 mb-1 tracking-widest uppercase">{label}</p>
                <p className="text-sm font-semibold text-slate-200 tracking-tight">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
          <Link href={`/materials/${id}/present`} className="flex-1 inline-flex items-center justify-center gap-2 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all duration-300 shadow-lg shadow-blue-500/25">
            <Presentation size={18} /> Buka Presentasi
          </Link>
          <button onClick={handleDownload} className="flex-1 inline-flex items-center justify-center gap-2 py-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-slate-200 font-semibold transition-all duration-300">
            <Download size={18} /> Download File
          </button>
        </div>
      </div>
    </div>
  );
}
