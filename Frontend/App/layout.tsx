// ============================================================
// FILE: frontend/app/layout.tsx
// PURPOSE: Root layout — loads fonts, sets metadata, wraps
//          all pages with Navbar and Footer.
// ============================================================

import type { Metadata, Viewport } from 'next';
import { Crimson_Pro, Nunito } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import './globals.css';

// Crimson Pro: elegant display serif for headings
const crimson = Crimson_Pro({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-crimson',
  display: 'swap',
});

// Nunito: friendly, mobile-optimised body font
const nunito = Nunito({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-nunito',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'NIFES Awka Zone — Training Students to Transform Society',
    template: '%s | NIFES Awka Zone',
  },
  description:
    'Nigeria Fellowship of Evangelical Students, Awka Zone. Join us for Bible study, fellowship, conferences, and student ministry across Awka region universities.',
  keywords: ['NIFES', 'Awka', 'NIFES Awka Zone', 'student fellowship', 'evangelical students Nigeria'],
  openGraph: {
    title: 'NIFES Awka Zone',
    description: 'Training Students to Transform Society',
    type: 'website',
    locale: 'en_NG',
    siteName: 'NIFES Awka Zone',
  },
  twitter: { card: 'summary_large_image' },
};

// Optimise for mobile — important for data-constrained users
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1B4332',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${crimson.variable} ${nunito.variable}`}>
      <body className="font-body bg-nifes-cream text-nifes-text antialiased">
        {/* Toast notifications for form submissions */}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: { fontFamily: 'var(--font-nunito)', fontSize: '14px' },
            success: { iconTheme: { primary: '#1B4332', secondary: '#fff' } },
          }}
        />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
