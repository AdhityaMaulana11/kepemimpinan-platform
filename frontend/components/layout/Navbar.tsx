'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { useAuth } from '@/hooks/useAuth';
import { LogIn, UserPlus, LogOut, LayoutDashboard, Shield, Menu, X, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isLoggedIn, user } = useAuthStore();
  const { logout, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-500', scrolled ? 'glass border-b border-blue-500/10 py-3' : 'bg-transparent py-5')}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg group-hover:shadow-blue-500/40 transition-shadow duration-300">
              <Zap size={18} className="text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-sm font-bold text-white tracking-tight">Kepemimpinan</span>
              <span className="text-xs text-blue-400 font-medium">Platform</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            <Link href="/materials" className="px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200">
              Materi
            </Link>
            {isLoggedIn ? (
              <>
                {isAdmin && (
                  <Link href="/admin" className="flex items-center gap-1.5 px-4 py-2 text-sm text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 rounded-lg transition-all duration-200">
                    <Shield size={14} /> Admin
                  </Link>
                )}
                <Link href="/dashboard" className="flex items-center gap-1.5 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200">
                  <LayoutDashboard size={14} /> Dashboard
                </Link>
                <div className="w-px h-5 bg-slate-700 mx-1" />
                <span className="text-sm text-slate-400 px-2">{user?.full_name?.split(' ')[0]}</span>
                <button onClick={logout} className="flex items-center gap-1.5 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200">
                  <LogOut size={14} /> Keluar
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="flex items-center gap-1.5 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                  <LogIn size={14} /> Masuk
                </Link>
                <Link href="/register" className="btn-primary text-sm py-2 px-5">
                  <span className="flex items-center gap-1.5"><UserPlus size={14} /> Daftar Gratis</span>
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden p-2 text-slate-400 hover:text-white transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-white/5 pt-4 space-y-1 animate-fade-in">
            <Link href="/materials" className="block px-3 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg" onClick={() => setMobileOpen(false)}>Materi</Link>
            {isLoggedIn ? (
              <>
                {isAdmin && <Link href="/admin" className="block px-3 py-2.5 text-sm text-purple-400 hover:bg-purple-500/10 rounded-lg" onClick={() => setMobileOpen(false)}>Admin</Link>}
                <Link href="/dashboard" className="block px-3 py-2.5 text-sm text-slate-300 hover:bg-white/5 rounded-lg" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                <button onClick={() => { logout(); setMobileOpen(false); }} className="block w-full text-left px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-lg">Keluar</button>
              </>
            ) : (
              <>
                <Link href="/login" className="block px-3 py-2.5 text-sm text-slate-300 hover:bg-white/5 rounded-lg" onClick={() => setMobileOpen(false)}>Masuk</Link>
                <Link href="/register" className="block px-3 py-2.5 text-sm text-blue-400 hover:bg-blue-500/10 rounded-lg" onClick={() => setMobileOpen(false)}>Daftar Gratis</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
