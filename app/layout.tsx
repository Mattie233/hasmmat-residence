import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hasmmat Residence | Stylish 4-Bedroom Stay in Leeds',
  description: 'High-quality serviced accommodation in Leeds for families, contractors, groups and football fans near Elland Road.',
  metadataBase: new URL('https://hasmmatresidence.com'),
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg'
  },
  openGraph: {
    title: 'Hasmmat Residence | Stylish 4-Bedroom Stay in Leeds',
    description: 'Book direct for quality family, contractor and group accommodation near Elland Road.',
    type: 'website',
    url: 'https://hasmmatresidence.com',
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
    title: 'Hasmmat Residence | Stylish Stay in Leeds',
    description: 'High-quality serviced accommodation near Elland Road with direct booking and family-friendly stays.'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
