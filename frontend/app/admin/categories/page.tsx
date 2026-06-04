'use client';

import { useState } from 'react';
import { useCategories } from '@/hooks/useFiles';
import { categoriesApi } from '@/lib/api';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, X, Loader2, Save, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';

export default function AdminCategoriesPage() {
  const qc = useQueryClient();
  const { data: categories, isLoading } = useCategories();
  const [showForm, setShowForm] = useState(false);
  const [editCat, setEditCat] = useState<null | { id: string; name: string; slug: string; description?: string }>(null);
  const [form, setForm] = useState({ name: '', slug: '', description: '' });
  const [saving, setSaving] = useState(false);

  const slugify = (s: string) => s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const openCreate = () => { setEditCat(null); setForm({ name: '', slug: '', description: '' }); setShowForm(true); };
  const openEdit = (c: { id: string; name: string; slug: string; description?: string }) => { setEditCat(c); setForm({ name: c.name, slug: c.slug, description: c.description ?? '' }); setShowForm(true); };

  const save = async () => {
    if (!form.name || !form.slug) { toast.error('Nama dan slug wajib diisi'); return; }
    setSaving(true);
    try {
      if (editCat) {
        await categoriesApi.update(editCat.id, form);
        toast.success('Kategori diperbarui');
      } else {
        await categoriesApi.create(form);
        toast.success('Kategori ditambahkan');
      }
      qc.invalidateQueries({ queryKey: ['categories'] });
      setShowForm(false);
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Hapus kategori ini?')) return;
    await categoriesApi.delete(id);
    qc.invalidateQueries({ queryKey: ['categories'] });
    toast.success('Kategori dihapus');
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Manajemen Kategori</h1>
          <p className="text-slate-400 text-sm">{categories?.length ?? 0} kategori</p>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm py-2 px-4">
          <span className="flex items-center gap-1.5"><Plus size={14} /> Tambah Kategori</span>
        </button>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-12 rounded-xl" />)}</div>
        ) : !categories?.length ? (
          <div className="text-center py-16">
            <Tag size={36} className="text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">Belum ada kategori. Tambahkan sekarang!</p>
          </div>
        ) : (
          <table className="data-table">
            <thead><tr><th>Nama</th><th>Slug</th><th>Deskripsi</th><th>Dibuat</th><th>Aksi</th></tr></thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td className="text-white font-medium">{cat.name}</td>
                  <td><code className="text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">{cat.slug}</code></td>
                  <td className="text-slate-400 max-w-xs truncate">{cat.description ?? '—'}</td>
                  <td className="text-slate-400">{formatDate(cat.created_at)}</td>
                  <td>
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(cat)} className="p-1.5 text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"><Pencil size={14} /></button>
                      <button onClick={() => remove(cat.id)} className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card rounded-2xl p-6 w-full max-w-md animate-fade-in-up">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-white">{editCat ? 'Edit Kategori' : 'Tambah Kategori'}</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-500 hover:text-white"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Nama *</label>
                <input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value, slug: slugify(e.target.value) }))} className="input-field" placeholder="Kepemimpinan Dasar" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Slug *</label>
                <input value={form.slug} onChange={(e) => setForm(f => ({ ...f, slug: e.target.value }))} className="input-field font-mono text-sm" placeholder="kepemimpinan-dasar" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Deskripsi</label>
                <textarea value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} rows={2} className="input-field resize-none" placeholder="Deskripsi singkat..." />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="btn-outline flex-1 justify-center py-2.5 text-sm">Batal</button>
              <button onClick={save} disabled={saving} className="btn-primary flex-1 justify-center py-2.5 text-sm">
                <span className="flex items-center gap-1.5">{saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Simpan</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
