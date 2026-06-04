'use client';

import { useFile } from '@/hooks/useFiles';
import { filesApi } from '@/lib/api';
import { isImageFile, isVideoFile, isPdfFile, isOfficeFile } from '@/lib/utils';
import Link from 'next/link';
import { ArrowLeft, Download, Share2, Loader2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

function OfficeViewer({ url, title }: { url: string; title: string }) {
  const [loaded, setLoaded] = useState(false);
  const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
  return (
    <div className="relative w-full h-full">
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center animate-pulse-glow">
            <Loader2 size={28} className="animate-spin text-blue-400" />
          </div>
          <p className="text-slate-400 text-sm">Memuat {title}...</p>
        </div>
      )}
      <iframe
        src={viewerUrl}
        className="w-full h-full border-0 rounded-xl"
        onLoad={() => setLoaded(true)}
        style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.5s ease' }}
        title={title}
        allow="fullscreen"
      />
    </div>
  );
}

function ImageViewer({ url, title }: { url: string; title: string }) {
  const [zoom, setZoom] = useState(1);
  return (
    <div className="w-full h-full flex items-center justify-center overflow-auto">
      <div style={{ transform: `scale(${zoom})`, transition: 'transform 0.3s ease', transformOrigin: 'center center' }}>
        <img src={url} alt={title} className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 glass rounded-full px-4 py-2">
        <button onClick={() => setZoom(z => Math.max(0.5, z - 0.25))} className="text-slate-300 hover:text-white w-7 h-7 flex items-center justify-center">−</button>
        <span className="text-xs text-slate-400 w-12 text-center">{Math.round(zoom * 100)}%</span>
        <button onClick={() => setZoom(z => Math.min(3, z + 0.25))} className="text-slate-300 hover:text-white w-7 h-7 flex items-center justify-center">+</button>
      </div>
    </div>
  );
}

function VideoViewer({ url, title }: { url: string; title: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <video
        src={url}
        controls
        className="max-w-full max-h-full rounded-xl shadow-2xl"
        style={{ maxHeight: '80vh' }}
        title={title}
      />
    </div>
  );
}

function PdfViewer({ url, title }: { url: string; title: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative w-full h-full">
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <Loader2 size={28} className="animate-spin text-blue-400" />
          <p className="text-slate-400 text-sm">Memuat PDF...</p>
        </div>
      )}
      <iframe
        src={`${url}#toolbar=1&navpanes=1`}
        className="w-full h-full border-0 rounded-xl"
        onLoad={() => setLoaded(true)}
        style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.5s ease' }}
        title={title}
      />
    </div>
  );
}

export default function PresentPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { data: file, isLoading } = useFile(id);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') window.history.back();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleDownload = async () => {
    try {
      const res = await filesApi.getDownloadUrl(id);
      window.open(res.data.data.download_url, '_blank');
    } catch {
      toast.error('Gagal mengunduh file');
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link disalin ke clipboard!');
    } catch {
      toast.error('Gagal menyalin link');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#02060f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center animate-pulse-glow">
            <Loader2 size={28} className="animate-spin text-blue-400" />
          </div>
          <p className="text-slate-400">Memuat presentasi...</p>
        </div>
      </div>
    );
  }

  if (!file) {
    return (
      <div className="min-h-screen bg-[#02060f] flex flex-col items-center justify-center gap-4">
        <p className="text-slate-400 text-lg">File tidak ditemukan</p>
        <Link href="/materials" className="btn-outline text-sm">← Kembali</Link>
      </div>
    );
  }

  const renderViewer = () => {
    const type = file.file_type.toLowerCase();
    if (isPdfFile(type)) return <PdfViewer url={file.file_url} title={file.title} />;
    if (isOfficeFile(type)) return <OfficeViewer url={file.file_url} title={file.title} />;
    if (isImageFile(type)) return <ImageViewer url={file.file_url} title={file.title} />;
    if (isVideoFile(type)) return <VideoViewer url={file.file_url} title={file.title} />;
    return (
      <div className="flex flex-col items-center justify-center h-full gap-6">
        <div className="text-6xl">📁</div>
        <p className="text-slate-400">Tipe file ini tidak bisa ditampilkan secara langsung</p>
        <button onClick={handleDownload} className="btn-primary">
          <span className="flex items-center gap-2"><Download size={16} /> Download File</span>
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#02060f] flex flex-col">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/5 glass flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link href={`/materials/${id}`} className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-sm">
            <ArrowLeft size={16} /> Kembali
          </Link>
          <div className="w-px h-5 bg-slate-700" />
          <span className="text-sm font-medium text-white line-clamp-1 max-w-xs sm:max-w-sm md:max-w-lg">{file.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <a href={file.file_url} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all" title="Buka di tab baru">
            <ExternalLink size={16} />
          </a>
          <button onClick={handleShare} className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all" title="Bagikan">
            <Share2 size={16} />
          </button>
          <button onClick={handleDownload} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg transition-all">
            <Download size={14} /> Download
          </button>
        </div>
      </div>

      {/* Viewer */}
      <div className="flex-1 relative p-4 sm:p-6" style={{ minHeight: 'calc(100vh - 57px)' }}>
        {renderViewer()}
      </div>
    </div>
  );
}
