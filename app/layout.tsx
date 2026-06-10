import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hasmmat Residence | Luxury 4 Bedroom Stay in Leeds',
  description: 'Premium serviced accommodation in Leeds for families, contractors, groups and football fans near Elland Road.',
  metadataBase: new URL('https://www.hasmmat-residence.com'),
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg'
  },
  openGraph: {
    title: 'Hasmmat Residence | Luxury 4 Bedroom Stay in Leeds',
    description: 'Book direct for premium family, contractor and group accommodation near Elland Road.',
    type: 'website',
    url: 'https://www.hasmmat-residence.com',
    images: [
      {
        url: '/images/hasmmatres62/PHOTO-2026-04-11-00-10-02_4.jpg',
        width: 1200,
        height: 630
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hasmmat Residence | Luxury Stay in Leeds',
    description: 'Premium serviced accommodation near Elland Road with direct booking and family-friendly stays.'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
