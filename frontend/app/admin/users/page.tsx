'use client';

import { useState } from 'react';
import { useAdminUsers, useUpdateUser, useDeleteUser } from '@/hooks/useAdmin';
import { formatDate } from '@/lib/utils';
import { Trash2, Pencil, X, Loader2, Save, Shield, User } from 'lucide-react';

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [editUser, setEditUser] = useState<null | { id: string; full_name: string; email: string; role: string }>(null);
  const [editRole, setEditRole] = useState('user');

  const { data, isLoading } = useAdminUsers(page, 10);
  const { mutate: updateUser, isPending: updating } = useUpdateUser();
  const { mutate: deleteUser } = useDeleteUser();

  const users = data?.users ?? [];
  const totalPages = data?.totalPages ?? 1;

  const openEdit = (u: { id: string; full_name: string; email: string; role: string }) => { setEditUser(u); setEditRole(u.role); };
  const saveEdit = () => {
    if (!editUser) return;
    updateUser({ id: editUser.id, data: { role: editRole } }, { onSuccess: () => setEditUser(null) });
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Manajemen Pengguna</h1>
        <p className="text-slate-400 text-sm">{data?.total ?? 0} pengguna terdaftar</p>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr><th>Nama</th><th>Email</th><th>Role</th><th>Bergabung</th><th>Aksi</th></tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => <tr key={i}><td colSpan={5}><div className="skeleton h-8 rounded" /></td></tr>)
              ) : users.map((user: import('@/types').User & { email: string; created_at?: string }) => (
                <tr key={user.id}>
                  <td className="text-white font-medium">{user.full_name}</td>
                  <td className="text-slate-400">{user.email}</td>
                  <td>
                    <span className={`badge ${user.role === 'admin' ? 'bg-purple-500/15 text-purple-400 border-purple-500/30' : 'bg-slate-700/50 text-slate-400 border-slate-600/30'}`}>
                      {user.role === 'admin' ? <Shield size={10} className="inline mr-1" /> : <User size={10} className="inline mr-1" />}
                      {user.role}
                    </span>
                  </td>
                  <td className="text-slate-400">{formatDate(user.created_at)}</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(user)} className="p-1.5 text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => confirm('Hapus pengguna ini?') && deleteUser(user.id)} className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/5">
            <span className="text-xs text-slate-500">Halaman {page} dari {totalPages}</span>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 text-xs rounded-lg border border-white/10 text-slate-400 hover:text-white disabled:opacity-30 transition-all">← Prev</button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 text-xs rounded-lg border border-white/10 text-slate-400 hover:text-white disabled:opacity-30 transition-all">Next →</button>
            </div>
          </div>
        )}
      </div>

      {editUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card rounded-2xl p-6 w-full max-w-sm animate-fade-in-up">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-white">Edit Pengguna</h3>
              <button onClick={() => setEditUser(null)} className="text-slate-500 hover:text-white"><X size={18} /></button>
            </div>
            <div className="mb-2 text-sm text-slate-400">
              <p className="font-medium text-white">{editUser.full_name}</p>
              <p>{editUser.email}</p>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">Role</label>
              <select value={editRole} onChange={(e) => setEditRole(e.target.value)} className="input-field cursor-pointer">
                <option value="user" style={{ background: '#111827' }}>user</option>
                <option value="admin" style={{ background: '#111827' }}>admin</option>
              </select>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditUser(null)} className="btn-outline flex-1 justify-center py-2.5 text-sm">Batal</button>
              <button onClick={saveEdit} disabled={updating} className="btn-primary flex-1 justify-center py-2.5 text-sm">
                <span className="flex items-center gap-1.5">{updating ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Simpan</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
