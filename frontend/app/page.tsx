import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import CurriculumSection from '@/components/home/CurriculumSection';
import FileRepoSection from '@/components/home/FileRepoSection';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kepemimpinan Platform — Belajar Kepemimpinan Efektif & Manajemen Tim',
  description: 'Platform pembelajaran kepemimpinan dan manajemen tim. Akses 500+ materi presentasi, dokumen, dan video secara gratis.',
};

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <CurriculumSection />
      <FileRepoSection />
      <Footer />
    </main>
  );
}
