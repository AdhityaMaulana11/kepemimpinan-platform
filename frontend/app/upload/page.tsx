'use client';

import { useState, useRef } from 'react';
import Navbar from '@/components/layout/Navbar';
import { useUploadFile } from '@/hooks/useFiles';
import { useCategories } from '@/hooks/useFiles';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, CloudUpload, File, X, Loader2, CheckCircle } from 'lucide-react';
import { formatFileSize } from '@/lib/utils';

const schema = z.object({
  title: z.string().min(3, 'Judul minimal 3 karakter'),
  description: z.string().optional(),
  category_id: z.string().optional(),
  is_published: z.boolean(),
});
type FormData = z.infer<typeof schema>;

const ALLOWED = ['pdf','docx','pptx','xlsx','jpg','jpeg','png','gif','mp4','webm'];

export default function UploadPage() {
  const router = useRouter();
  const { mutateAsync: uploadFile } = useUploadFile();
  const { data: categories } = useCategories();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as import('react-hook-form').Resolver<FormData>,
    defaultValues: { is_published: true },
  });

  const handleFile = (f: File) => {
    const ext = f.name.split('.').pop()?.toLowerCase() ?? '';
    if (!ALLOWED.includes(ext)) { alert(`Tipe file .${ext} tidak didukung`); return; }
    if (f.size > 50 * 1024 * 1024) { alert('File terlalu besar. Maksimum 50MB'); return; }
    setSelectedFile(f);
  };

  const onSubmit = async (data: FormData) => {
    if (!selectedFile) { alert('Pilih file terlebih dahulu'); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('file', selectedFile);
      fd.append('title', data.title);
      if (data.description) fd.append('description', data.description);
      if (data.category_id) fd.append('category_id', data.category_id);
      fd.append('is_published', String(data.is_published));
      await uploadFile(fd);
      setSuccess(true);
      setTimeout(() => router.push('/materials'), 2000);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-fade-in-up">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
            <CheckCircle size={36} className="text-green-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">File Berhasil Diunggah!</h2>
          <p className="text-slate-400 text-sm">Mengalihkan ke halaman materi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Unggah Materi</h1>
          <p className="text-slate-400 text-sm">Bagikan materi kepemimpinan Anda dengan komunitas</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 ${dragging ? 'border-blue-500 bg-blue-500/5' : 'border-white/10 hover:border-blue-500/40 hover:bg-white/2'}`}
          >
            <input ref={fileRef} type="file" className="hidden" accept={ALLOWED.map(e => `.${e}`).join(',')} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            {selectedFile ? (
              <div className="flex items-center justify-center gap-3">
                <File size={28} className="text-blue-400" />
                <div className="text-left">
                  <p className="text-white font-medium text-sm">{selectedFile.name}</p>
                  <p className="text-slate-500 text-xs">{formatFileSize(selectedFile.size)}</p>
                </div>
                <button type="button" onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }} className="ml-2 text-slate-500 hover:text-red-400 transition-colors">
                  <X size={18} />
                </button>
              </div>
            ) : (
              <div>
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                  <CloudUpload size={26} className="text-blue-400" />
                </div>
                <p className="text-white font-semibold mb-1">Seret file ke sini atau klik untuk memilih</p>
                <p className="text-slate-500 text-xs">PDF, PPTX, DOCX, XLSX, JPG, PNG, MP4 — Maks. 50MB</p>
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Judul Materi *</label>
            <input {...register('title')} type="text" placeholder="Contoh: Kepemimpinan Transformasional" className="input-field" />
            {errors.title && <p className="text-xs text-red-400 mt-1.5">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Deskripsi</label>
            <textarea {...register('description')} rows={3} placeholder="Deskripsi singkat tentang materi ini..." className="input-field resize-none" />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Kategori</label>
            <select {...register('category_id')} className="input-field cursor-pointer">
              <option value="" style={{ background: '#111827' }}>Pilih Kategori</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id} style={{ background: '#111827' }}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Published */}
          <div className="flex items-center gap-3">
            <input {...register('is_published')} type="checkbox" id="is_published" className="w-4 h-4 accent-blue-500 rounded" defaultChecked />
            <label htmlFor="is_published" className="text-sm text-slate-300 cursor-pointer">Publikasikan materi setelah diunggah</label>
          </div>

          <button type="submit" disabled={loading || !selectedFile} className="btn-primary w-full justify-center py-3">
            <span className="flex items-center gap-2">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              {loading ? 'Mengunggah...' : 'Unggah Materi'}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
