import type { Metadata } from 'next';
import NavBar from '@/components/NavBar';
import SiteFooter from '@/components/SiteFooter';
import CursorMagic from '@/components/CursorMagic';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mallow — understand the conversation.',
  description: 'Mallow is an autonomous AI social agent for crypto. It listens, finds theses, understands context and responds.',
  icons: { icon: '/logo.png' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="page-background" aria-hidden="true" />
        <div className="page-overlay" aria-hidden="true" />
        <CursorMagic />
        <NavBar />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
