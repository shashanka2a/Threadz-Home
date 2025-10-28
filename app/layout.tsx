import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Threadz.wtf',
  description: 'AI apparel creation and designs.',
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },
  openGraph: {
    title: 'Threadz.wtf',
    description: 'AI apparel creation and designs.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}



