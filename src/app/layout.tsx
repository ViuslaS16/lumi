import type { Metadata } from 'next';
import './globals.css';
import { MainNavbar } from '@/components/MainNavbar';

export const metadata: Metadata = {
  title: 'Lumi — NovaEdge Learning Assistant',
  description: 'AI-powered Learning and Development assistant for NovaEdge Technologies. Ask about courses, policies, progress, badges, and quizzes.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-[#FFFBF5] text-[#292524] antialiased flex flex-col">
        <MainNavbar />
        <div className="flex-1 flex flex-col min-h-0">
          {children}
        </div>
      </body>
    </html>
  );
}
