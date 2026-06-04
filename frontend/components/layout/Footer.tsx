import Link from 'next/link';
import { Zap, Globe, Mail, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#060b18]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                <Zap size={18} className="text-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-sm font-bold text-white">Kepemimpinan</span>
                <span className="text-xs text-blue-400">Platform</span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Platform pembelajaran kepemimpinan dan manajemen tim profesional untuk mengembangkan potensi diri.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Platform</h4>
            <ul className="space-y-2">
              {[['Beranda', '/'], ['Materi', '/materials'], ['Masuk', '/login'], ['Daftar', '/register']].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-slate-400 hover:text-blue-400 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Topik</h4>
            <ul className="space-y-2">
              {['Kepemimpinan Dasar', 'Gaya Kepemimpinan', 'Komunikasi Tim'].map((t) => (
                <li key={t}>
                  <span className="text-sm text-slate-400">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">© {new Date().getFullYear()} Kepemimpinan Platform. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {[Globe, Mail, ExternalLink].map((Icon, i) => (
              <button key={i} className="text-slate-500 hover:text-blue-400 transition-colors">
                <Icon size={16} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
