import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'Threadz.studio',
  description: 'AI apparel creation and designs.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/threadz-logo.png',
    apple: '/threadz-logo.png',
  },
  openGraph: {
    title: 'Threadz.studio',
    description: 'AI apparel creation and designs.',
    images: ['/threadz-logo.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}



