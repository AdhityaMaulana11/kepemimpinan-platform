import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from 'sonner';

const font = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'Kepemimpinan Platform — Belajar Kepemimpinan Efektif',
  description:
    'Platform pembelajaran kepemimpinan dan manajemen tim profesional. Akses materi, presentasi, dan file kepemimpinan secara gratis.',
  keywords: ['kepemimpinan', 'leadership', 'manajemen tim', 'materi', 'presentasi'],
  openGraph: {
    title: 'Kepemimpinan Platform',
    description: 'Platform pembelajaran kepemimpinan dan manajemen tim profesional.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${font.variable} font-jakarta antialiased`}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            richColors
            toastOptions={{
              style: {
                background: '#0f172a',
                border: '1px solid rgba(59,130,246,0.2)',
                color: '#f1f5f9',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
