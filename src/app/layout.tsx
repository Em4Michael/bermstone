import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import SiteShell from '@/components/layout/SiteShell';

export const metadata: Metadata = {
  title: { default: 'Bermstone — Premium Real Estate & Shortlets', template: '%s | Bermstone' },
  description: 'Premium shortlet apartments and real estate investment opportunities in Nigeria.',
  keywords: ['shortlet', 'real estate', 'investment', 'Nigeria', 'Port Harcourt', 'Bermstone'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <AuthProvider>
          <SiteShell>{children}</SiteShell>
        </AuthProvider>
      </body>
    </html>
  );
}
