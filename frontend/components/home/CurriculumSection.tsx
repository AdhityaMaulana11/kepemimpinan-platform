'use client';

import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Target, Users, MessageSquare } from 'lucide-react';

const curriculum = [
  {
    number: '01',
    icon: Target,
    title: 'Kepemimpinan Dasar',
    description: 'Pelajari fondasi kepemimpinan yang efektif — mulai dari visi, misi, hingga cara membangun kepercayaan tim.',
    color: 'from-blue-500 to-cyan-500',
    topics: ['Visi & Misi', 'Integritas', 'Pengambilan Keputusan'],
  },
  {
    number: '02',
    icon: Users,
    title: 'Gaya Kepemimpinan',
    description: 'Kenali berbagai gaya kepemimpinan dan temukan pendekatan yang paling sesuai dengan situasi tim Anda.',
    color: 'from-violet-500 to-purple-600',
    topics: ['Transformasional', 'Servant Leadership', 'Situasional'],
  },
  {
    number: '03',
    icon: MessageSquare,
    title: 'Komunikasi Tim',
    description: 'Kuasai teknik komunikasi efektif untuk membangun tim yang solid, produktif, dan termotivasi.',
    color: 'from-emerald-500 to-teal-500',
    topics: ['Active Listening', 'Feedback Efektif', 'Resolusi Konflik'],
  },
];

export default function CurriculumSection() {
  const [active, setActive] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    const next = dir === 'right' ? Math.min(active + 1, curriculum.length - 1) : Math.max(active - 1, 0);
    setActive(next);
    if (scrollRef.current) {
      const card = scrollRef.current.children[next] as HTMLElement;
      card?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  };

  return (
    <section className="py-24 bg-[#080e1f] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(59,130,246,0.08) 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-3 block">Kurikulum</span>
            <h2 className="section-title text-white">Apa yang Akan <span className="gradient-text">Anda Pelajari</span></h2>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => scroll('left')} disabled={active === 0} className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-blue-500/40 disabled:opacity-30 transition-all">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => scroll('right')} disabled={active === curriculum.length - 1} className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-blue-500/40 disabled:opacity-30 transition-all">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Cards scroll */}
        <div ref={scrollRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {curriculum.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                onClick={() => setActive(i)}
                className={`glass-card rounded-2xl p-6 cursor-pointer transition-all duration-300 ${active === i ? 'border-blue-500/30 shadow-lg shadow-blue-500/10' : ''}`}
              >
                <div className="flex items-start justify-between mb-6">
                  <span className="text-4xl font-black text-white/5">{item.number}</span>
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}>
                    <Icon size={22} className="text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-5">{item.description}</p>
                <div className="flex flex-wrap gap-2">
                  {item.topics.map((t) => (
                    <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-slate-400 border border-white/5">{t}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {curriculum.map((_, i) => (
            <button key={i} onClick={() => setActive(i)} className={`transition-all duration-300 rounded-full ${i === active ? 'w-6 h-2 bg-blue-500' : 'w-2 h-2 bg-slate-600 hover:bg-slate-400'}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
