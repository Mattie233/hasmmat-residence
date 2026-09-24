import Link from 'next/link';
import { headers } from 'next/headers';
import { AboutSection } from '@/components/AboutSection';
import { FloatingCTA } from '@/components/FloatingCTA';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { Navbar } from '@/components/Navbar';
import { Reviews } from '@/components/Reviews';
import { siteInfo } from '@/lib/data';

export const dynamic = 'force-dynamic';

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'LodgingBusiness',
  name: siteInfo.name,
  description: siteInfo.shortDescription,
  image: 'https://hasmmatresidence.com/images/hasmmatres62/PHOTO-2026-04-11-00-10-02_4.jpg',
  address: {
    '@type': 'PostalAddress',
    ...siteInfo.address
  },
  telephone: siteInfo.phone,
  url: 'https://hasmmatresidence.com',
  priceRange: '£220+',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5',
    reviewCount: '124'
  },
  sameAs: [siteInfo.instagramUrl, siteInfo.tiktokUrl]
};

export default function Home() {
  const nonce = headers().get('x-csp-nonce') ?? undefined;

  return (
    <main className="relative overflow-hidden">
      <script nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <Navbar />
      <Hero />
      <section className="container py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-brand-300">Choose your stay</p>
          <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">A straightforward Leeds stay for your plans.</h2>
          <p className="mt-4 leading-8 text-brand-200">Explore the information that matches your visit, then send an enquiry with your dates and requirements.</p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            ['Family stays', 'Space, parking and a practical base for family visits.', '/accommodation-near-elland-road'],
            ['Contractor stays', 'Work-ready accommodation for project teams and longer stays.', '/contractor-accommodation-leeds'],
            ['Group stays', 'Keep your group together across four bedrooms and shared spaces.', '/group-accommodation-leeds']
          ].map(([title, description, href]) => (
            <Link key={href} href={href} className="rounded-[2rem] border border-white/10 bg-black/50 p-6 shadow-soft transition hover:border-brand-300/50">
              <h3 className="text-xl font-semibold text-white">{title}</h3>
              <p className="mt-3 leading-7 text-brand-200">{description}</p>
              <span className="mt-5 inline-flex text-sm font-semibold text-brand-300">Explore {title.toLowerCase()} →</span>
            </Link>
          ))}
        </div>
      </section>
      <Reviews />
      <Footer />
      <FloatingCTA />
    </main>
  );
}
