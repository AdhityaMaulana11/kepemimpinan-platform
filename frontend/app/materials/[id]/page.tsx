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
    <div className="min-h-screen bg-[#060b18] pt-32 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <Link 
          href="/materials" 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all duration-200 mb-8 text-sm border border-white/5 shadow-sm"
        >
          <ArrowLeft size={16} /> Kembali ke Materi
        </Link>

        {/* Header card */}
        <div className="glass-card rounded-3xl p-8 sm:p-10 mb-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
            <span className="text-5xl">{icon}</span>
            <div className="flex-1">
              <span className={`badge ${badgeClass} mb-3`}>.{file.file_type}</span>
              <h1 className="text-2xl font-bold text-white leading-tight">{file.title}</h1>
              {file.description && <p className="text-slate-400 text-sm mt-2 leading-relaxed">{file.description}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/5">
            {[
              { icon: Calendar, label: 'Tanggal', value: formatDate(file.created_at) },
              { icon: HardDrive, label: 'Ukuran', value: formatFileSize(file.file_size) },
              { icon: Eye, label: 'Dilihat', value: `${file.download_count ?? 0}x` },
              { icon: Download, label: 'Diunduh', value: `${file.download_count ?? 0}x` },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="text-center p-3 bg-white/3 rounded-xl">
                <Icon size={16} className="text-blue-400 mx-auto mb-1" />
                <p className="text-xs text-slate-500 mb-0.5">{label}</p>
                <p className="text-sm font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Link href={`/materials/${id}/present`} className="btn-primary flex-1 justify-center py-3">
            <span className="flex items-center gap-2"><Presentation size={18} /> Buka Presentasi</span>
          </Link>
          <button onClick={handleDownload} className="btn-outline flex-1 justify-center py-3">
            <Download size={18} /> Download
          </button>
        </div>
      </div>
    </div>
  );
}
