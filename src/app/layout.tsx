import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from '@/lib/providers';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'LezzetKeşif - Restoran Keşif Platformu',
  description: 'En iyi restoranları keşfedin, yorum ve puanları inceleyin.',
  metadataBase: new URL('https://lezzetkesif.example.com'),
  applicationName: 'LezzetKeşif',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: '/',
    siteName: 'LezzetKeşif',
    title: 'LezzetKeşif - Restoran Keşif Platformu',
    description: 'Ankara ve çevresindeki en iyi restoranları keşfedin.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LezzetKeşif - Restoran Keşif Platformu',
    description: 'Ankara ve çevresindeki en iyi restoranları keşfedin.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <Providers>{children}</Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
