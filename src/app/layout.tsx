import type { Metadata } from 'next';
import './globals.css';

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
      <body className="h-full bg-[#FFFBF5] text-[#292524] antialiased">
        {children}
      </body>
    </html>
  );
}
