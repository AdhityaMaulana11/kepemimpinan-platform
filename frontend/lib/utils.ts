import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFileSize(bytes?: number): string {
  if (!bytes) return 'N/A';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatDate(dateStr?: string): string {
  if (!dateStr) return '-';
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateStr));
}

export function getFileTypeColor(type: string): string {
  const map: Record<string, string> = {
    pdf: 'bg-red-500/15 text-red-400 border-red-500/30',
    pptx: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    docx: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    xlsx: 'bg-green-500/15 text-green-400 border-green-500/30',
    jpg: 'bg-pink-500/15 text-pink-400 border-pink-500/30',
    jpeg: 'bg-pink-500/15 text-pink-400 border-pink-500/30',
    png: 'bg-pink-500/15 text-pink-400 border-pink-500/30',
    gif: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    mp4: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    webm: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  };
  return map[type.toLowerCase()] ?? 'bg-gray-500/15 text-gray-400 border-gray-500/30';
}

export function getFileTypeIcon(type: string): string {
  const map: Record<string, string> = {
    pdf: '📄',
    pptx: '📊',
    docx: '📝',
    xlsx: '📈',
    jpg: '🖼️',
    jpeg: '🖼️',
    png: '🖼️',
    gif: '🎞️',
    mp4: '🎥',
    webm: '🎥',
  };
  return map[type.toLowerCase()] ?? '📁';
}

export function isImageFile(type: string): boolean {
  return ['jpg', 'jpeg', 'png', 'gif'].includes(type.toLowerCase());
}

export function isVideoFile(type: string): boolean {
  return ['mp4', 'webm'].includes(type.toLowerCase());
}

export function isPdfFile(type: string): boolean {
  return type.toLowerCase() === 'pdf';
}

export function isOfficeFile(type: string): boolean {
  return ['pptx', 'docx', 'xlsx'].includes(type.toLowerCase());
}
