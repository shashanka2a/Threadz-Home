import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Threadz.wtf',
  description: 'AI-powered apparel creation and designs.',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Threadz.wtf',
    description: 'AI-powered apparel creation and designs.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}



