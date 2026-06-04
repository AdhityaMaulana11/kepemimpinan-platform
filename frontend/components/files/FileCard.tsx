'use client';

import Link from 'next/link';
import { formatFileSize, formatDate, getFileTypeColor, getFileTypeIcon } from '@/lib/utils';
import { PlatformFile } from '@/types';
import { Download, Presentation, Eye } from 'lucide-react';
import { filesApi } from '@/lib/api';
import { toast } from 'sonner';

interface FileCardProps {
  file: PlatformFile;
  showActions?: boolean;
}

export default function FileCard({ file, showActions = true }: FileCardProps) {
  const badgeClass = getFileTypeColor(file.file_type);
  const icon = getFileTypeIcon(file.file_type);

  const handleDownload = async () => {
    try {
      const res = await filesApi.getDownloadUrl(file.id);
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

  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col gap-4 group">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          <span className={`badge ${badgeClass}`}>.{file.file_type}</span>
        </div>
        {file.download_count > 0 && (
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Download size={11} />
            {file.download_count}
          </div>
        )}
      </div>

      {/* Title */}
      <div className="flex-1">
        <h3 className="text-sm font-semibold text-white line-clamp-2 leading-snug group-hover:text-blue-300 transition-colors">
          {file.title}
        </h3>
        {file.description && (
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{file.description}</p>
        )}
      </div>

      {/* Meta */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{formatDate(file.created_at)}</span>
        <span>{formatFileSize(file.file_size)}</span>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex gap-2 pt-1 border-t border-white/5">
          <Link
            href={`/materials/${file.id}/present`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-all duration-200 hover:shadow-lg"
          >
            <Presentation size={13} />
            Presentasi
          </Link>
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 border border-blue-500/30 hover:border-blue-500/60 hover:bg-blue-500/10 text-blue-400 text-xs font-semibold rounded-lg transition-all duration-200"
          >
            <Download size={13} />
            Download
          </button>
        </div>
      )}
    </div>
  );
}
