'use client';

import { useState, useRef, useEffect } from 'react';
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

const MULTIPLIER = 40; // Makes it feel infinite (120 total items)
const extendedCurriculum = Array(MULTIPLIER).fill(curriculum).flat();
const INITIAL_ACTIVE = Math.floor(MULTIPLIER / 2) * curriculum.length;

export default function CurriculumSection() {
  const [active, setActive] = useState(INITIAL_ACTIVE);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Center initial active item on mount
  useEffect(() => {
    if (scrollRef.current) {
      const card = scrollRef.current.children[INITIAL_ACTIVE] as HTMLElement;
      if (card) {
        card.scrollIntoView({ block: 'nearest', inline: 'center' });
      }
    }
  }, []);

  const scrollTo = (index: number, smooth = true) => {
    setActive(index);
    if (scrollRef.current) {
      const card = scrollRef.current.children[index] as HTMLElement;
      if (card) {
        card.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'nearest', inline: 'center' });
      }
    }
  };

  const scroll = (dir: 'left' | 'right') => {
    const next = dir === 'right' ? active + 1 : active - 1;
    scrollTo(next);
  };

  // Auto-play when idle
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isDragging) scroll('right');
    }, 5000);
    return () => clearInterval(timer);
  }, [active, isDragging]);

  // Drag to scroll logic
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    if (scrollRef.current) {
      setStartX(e.pageX - scrollRef.current.offsetLeft);
      setScrollLeftPos(scrollRef.current.scrollLeft);
    }
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeftPos - walk;
  };

  // Track active item when scrolling manually
  const handleScroll = () => {
    if (!scrollRef.current || isDragging) return;
    const container = scrollRef.current;
    const scrollCenter = container.scrollLeft + container.clientWidth / 2;
    
    let closestIndex = active;
    let minDiff = Infinity;
    
    Array.from(container.children).forEach((child, index) => {
      const childEle = child as HTMLElement;
      const childCenter = childEle.offsetLeft + childEle.clientWidth / 2;
      const diff = Math.abs(childCenter - scrollCenter);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = index;
      }
    });
    
    if (closestIndex !== active) {
      setActive(closestIndex);
    }
  };

  // Dots logic (find closest index corresponding to the chosen dot)
  const handleDotClick = (dotIndex: number) => {
    const currentReal = active % curriculum.length;
    const offset = dotIndex - currentReal;
    scrollTo(active + offset);
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
            <button onClick={() => scroll('left')} className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-blue-500/40 transition-all">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => scroll('right')} className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-blue-500/40 transition-all">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Cards scroll */}
        <div 
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onScroll={handleScroll}
          className={`flex gap-6 overflow-x-auto pb-8 pt-4 select-none ${isDragging ? 'cursor-grabbing snap-none' : 'cursor-grab snap-x snap-mandatory'} transition-all`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {extendedCurriculum.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                onClick={() => !isDragging && scrollTo(i)}
                className={`flex-none w-[85vw] sm:w-[400px] lg:w-[380px] snap-center glass-card rounded-2xl p-6 transition-all duration-300 ${active === i ? 'border-blue-500/30 shadow-lg shadow-blue-500/10 scale-100 opacity-100' : 'scale-[0.98] opacity-50 hover:opacity-100'}`}
              >
                <div className="flex items-start justify-between mb-6">
                  <span className="text-4xl font-black text-white/5">{item.number}</span>
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}>
                    <Icon size={22} className="text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-3 pointer-events-none">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-5 pointer-events-none">{item.description}</p>
                <div className="flex flex-wrap gap-2 pointer-events-none">
                  {item.topics.map((t) => (
                    <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-slate-400 border border-white/5">{t}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-2">
          {curriculum.map((_, i) => (
            <button 
              key={i} 
              onClick={() => handleDotClick(i)} 
              className={`transition-all duration-300 rounded-full ${(active % curriculum.length) === i ? 'w-8 h-2 bg-blue-500' : 'w-2 h-2 bg-slate-600 hover:bg-slate-400'}`} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}
