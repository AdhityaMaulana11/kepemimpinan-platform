'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Play, Upload, Users, BookOpen, Clock } from 'lucide-react';

const badges = [
  { icon: BookOpen, label: '500+ Materi', color: 'text-blue-400' },
  { icon: Users, label: 'Gratis Bergabung', color: 'text-violet-400' },
  { icon: Clock, label: 'Akses Kapan Saja', color: 'text-emerald-400' },
];

export default function HeroSection() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background blobs */}
      <div className="hero-blob w-[600px] h-[600px] bg-blue-600/20 top-[-100px] right-[-100px] animate-float" style={{ animationDelay: '0s' }} />
      <div className="hero-blob w-[400px] h-[400px] bg-violet-600/15 bottom-[-50px] left-[-80px] animate-float" style={{ animationDelay: '2s' }} />
      <div className="hero-blob w-[300px] h-[300px] bg-cyan-600/10 top-1/3 left-1/3 animate-float" style={{ animationDelay: '1s' }} />

      {/* Animated grid */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(rgba(59,130,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="max-w-4xl">
          {/* Eyebrow */}
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 text-xs font-semibold mb-8 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Platform Kepemimpinan #1 Indonesia
          </div>

          {/* Headline */}
          <h1 className={`section-title text-white mb-6 transition-all duration-700 delay-100 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            Kepemimpinan{' '}
            <span className="gradient-text-animated">Efektif</span>
            {' '}& Manajemen{' '}
            <span className="gradient-text-animated" style={{ animationDelay: '1s' }}>Tim</span>
          </h1>

          {/* Subtitle */}
          <p className={`text-lg text-slate-400 leading-relaxed max-w-2xl mb-10 transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            Akses ratusan materi presentasi, dokumen, dan video kepemimpinan secara gratis. Tingkatkan kemampuan manajerial dan kepemimpinan Anda hari ini.
          </p>

          {/* CTAs */}
          <div className={`flex flex-wrap gap-4 mb-16 transition-all duration-700 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <Link href="/materials" className="btn-primary">
              <span className="flex items-center gap-2">
                <Play size={16} />
                Mulai Presentasi
              </span>
            </Link>
            <Link href="/upload" className="btn-outline">
              <Upload size={16} />
              Unggah Materi
            </Link>
          </div>

          {/* Trust badges */}
          <div className={`flex flex-wrap gap-6 transition-all duration-700 delay-400 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            {badges.map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center ${color}`}>
                  <Icon size={16} />
                </div>
                <span className="text-sm text-slate-300 font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#060b18] to-transparent" />
    </section>
  );
}
