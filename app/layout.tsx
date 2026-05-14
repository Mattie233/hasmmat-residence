import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hasmmat Residence | Luxury 4 Bedroom Stay in Leeds',
  description: 'Premium serviced accommodation in Leeds for families, contractors, groups and football fans near Elland Road.',
  metadataBase: new URL('https://www.hasmmat-residence.com'),
  openGraph: {
    title: 'Hasmmat Residence | Luxury 4 Bedroom Stay in Leeds',
    description: 'Book direct for premium family, contractor and group accommodation near Elland Road.',
    type: 'website',
    url: 'https://www.hasmmat-residence.com',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
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
