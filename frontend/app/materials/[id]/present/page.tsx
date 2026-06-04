'use client';

import { useFile } from '@/hooks/useFiles';
import { filesApi } from '@/lib/api';
import { isImageFile, isVideoFile, isPdfFile, isOfficeFile } from '@/lib/utils';
import Link from 'next/link';
import { ArrowLeft, Download, Share2, Loader2, ExternalLink, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { useState, useEffect, useCallback } from 'react';

/* ─── Sub-viewers ──────────────────────────────────────────────────── */

function OfficeViewer({ url, title }: { url: string; title: string }) {
  const [loaded, setLoaded] = useState(false);
  // Using Microsoft Office Web Viewer (much more reliable for .pptx, .xlsx, .docx than Google Docs Viewer)
  const viewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
  return (
    <div className="relative w-full h-full">
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 z-10">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Loader2 size={32} className="animate-spin text-blue-400" />
            </div>
            <div className="absolute -inset-2 rounded-3xl border border-blue-500/10 animate-ping" />
          </div>
          <div className="text-center">
            <p className="text-white font-medium text-sm mb-1">Memuat Dokumen</p>
            <p className="text-slate-500 text-xs max-w-48 text-center">{title}</p>
          </div>
        </div>
      )}
      <iframe
        src={viewerUrl}
        className="w-full h-full border-0 rounded-xl"
        onLoad={() => setLoaded(true)}
        style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.6s ease' }}
        title={title}
        allow="fullscreen"
      />
    </div>
  );
}

function ImageViewer({ url, title }: { url: string; title: string }) {
  const [zoom, setZoom] = useState(1);
  const resetZoom = () => setZoom(1);
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <div
        style={{ transform: `scale(${zoom})`, transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1)', transformOrigin: 'center center' }}
        className="cursor-zoom-in"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt={title} className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl select-none" draggable={false} />
      </div>
      {/* Zoom controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1 glass rounded-full px-3 py-2 border border-white/10 shadow-lg">
        <button
          onClick={() => setZoom(z => Math.max(0.25, z - 0.25))}
          className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          title="Perkecil"
        >
          <ZoomOut size={15} />
        </button>
        <span className="text-xs font-mono text-slate-300 w-12 text-center">{Math.round(zoom * 100)}%</span>
        <button
          onClick={() => setZoom(z => Math.min(4, z + 0.25))}
          className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          title="Perbesar"
        >
          <ZoomIn size={15} />
        </button>
        <div className="w-px h-4 bg-white/10 mx-1" />
        <button
          onClick={resetZoom}
          className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          title="Reset zoom"
        >
          <RotateCcw size={14} />
        </button>
      </div>
    </div>
  );
}

function VideoViewer({ url, title }: { url: string; title: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <video
        src={url}
        controls
        className="w-full rounded-2xl shadow-2xl ring-1 ring-white/10"
        style={{ maxHeight: '82vh' }}
        title={title}
        controlsList="nodownload"
      />
    </div>
  );
}

function PdfViewer({ url, title }: { url: string; title: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative w-full h-full">
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 z-10">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <Loader2 size={32} className="animate-spin text-red-400" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-white font-medium text-sm mb-1">Memuat PDF</p>
            <p className="text-slate-500 text-xs">{title}</p>
          </div>
        </div>
      )}
      <iframe
        src={`${url}#toolbar=1&navpanes=1&view=FitH`}
        className="w-full h-full border-0 rounded-xl"
        onLoad={() => setLoaded(true)}
        style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.6s ease' }}
        title={title}
      />
    </div>
  );
}

function UnsupportedViewer({ onDownload }: { onDownload: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      <div className="w-24 h-24 rounded-3xl bg-slate-800/60 border border-slate-700/40 flex items-center justify-center text-4xl">
        📁
      </div>
      <div className="text-center">
        <p className="text-white font-semibold mb-2">Format Tidak Didukung</p>
        <p className="text-slate-500 text-sm">Tipe file ini tidak dapat ditampilkan langsung.</p>
      </div>
      <button onClick={onDownload} className="btn-primary">
        <span className="flex items-center gap-2"><Download size={16} /> Download File</span>
      </button>
    </div>
  );
}

/* ─── Main Page ────────────────────────────────────────────────────── */

export default function PresentPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { data: file, isLoading } = useFile(id);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') window.history.back();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleDownload = useCallback(async () => {
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
  }, [id]);

  const handleShare = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link berhasil disalin!');
    } catch {
      toast.error('Gagal menyalin link');
    }
  }, []);

  /* Loading state */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#02060f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center animate-pulse-glow">
              <Loader2 size={32} className="animate-spin text-blue-400" />
            </div>
            <div className="absolute -inset-3 rounded-3xl border border-blue-500/10 animate-ping opacity-50" />
          </div>
          <div className="text-center">
            <p className="text-white font-medium">Menyiapkan Presentasi</p>
            <p className="text-slate-500 text-sm mt-1">Mohon tunggu sebentar...</p>
          </div>
        </div>
      </div>
    );
  }

  /* Not found */
  if (!file) {
    return (
      <div className="min-h-screen bg-[#02060f] flex flex-col items-center justify-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-slate-800/60 border border-slate-700/40 flex items-center justify-center text-4xl">
          🔍
        </div>
        <div className="text-center">
          <p className="text-white font-semibold text-lg mb-1">File Tidak Ditemukan</p>
          <p className="text-slate-500 text-sm">File mungkin sudah dihapus atau tidak tersedia.</p>
        </div>
        <Link href="/materials" className="btn-outline text-sm">← Kembali ke Materi</Link>
      </div>
    );
  }

  const type = file.file_type.toLowerCase();
  const renderViewer = () => {
    if (isPdfFile(type))    return <PdfViewer url={file.file_url} title={file.title} />;
    if (isOfficeFile(type)) return <OfficeViewer url={file.file_url} title={file.title} />;
    if (isImageFile(type))  return <ImageViewer url={file.file_url} title={file.title} />;
    if (isVideoFile(type))  return <VideoViewer url={file.file_url} title={file.title} />;
    return <UnsupportedViewer onDownload={handleDownload} />;
  };

  /* File type accent color */
  const typeAccent =
    isPdfFile(type) ? 'text-red-400 bg-red-500/10 border-red-500/20' :
    isOfficeFile(type) ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' :
    isImageFile(type) ? 'text-purple-400 bg-purple-500/10 border-purple-500/20' :
    isVideoFile(type) ? 'text-green-400 bg-green-500/10 border-green-500/20' :
    'text-slate-400 bg-slate-500/10 border-slate-500/20';

  return (
    <div className="h-screen bg-[#02060f] flex flex-col overflow-hidden">

      {/* ── Top Navigation Bar ── */}
      <header className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 h-14 border-b border-white/[0.06]"
        style={{ background: 'rgba(6,11,24,0.92)', backdropFilter: 'blur(20px)' }}>

        {/* Left: back + title */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href={`/materials/${id}`}
            className="flex-shrink-0 flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-sm font-medium group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline">Kembali</span>
          </Link>
          <div className="w-px h-5 bg-white/10 flex-shrink-0" />
          <div className="flex items-center gap-2 min-w-0">
            <span className={`flex-shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${typeAccent}`}>
              .{file.file_type}
            </span>
            <span className="text-sm font-medium text-white truncate max-w-[180px] sm:max-w-sm md:max-w-lg">
              {file.title}
            </span>
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <a
            href={file.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/8 transition-all"
            title="Buka di tab baru"
          >
            <ExternalLink size={15} />
          </a>
          <button
            onClick={handleShare}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/8 transition-all"
            title="Salin link"
          >
            <Share2 size={15} />
          </button>
          <div className="w-px h-5 bg-white/10 mx-1" />
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{ background: 'linear-gradient(135deg,#3b82f6,#6366f1)', color: 'white' }}
          >
            <Download size={13} />
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>
      </header>

      {/* ── Viewer Area ── */}
      <main className="flex-1 relative overflow-hidden">
        {renderViewer()}

        {/* ESC hint */}
        <div className="absolute top-3 right-4 pointer-events-none">
          <span className="text-[10px] text-slate-600 font-mono bg-slate-900/50 px-2 py-1 rounded-md border border-slate-800/50">
            ESC ← Kembali
          </span>
        </div>
      </main>
    </div>
  );
}
