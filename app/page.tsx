import Link from 'next/link';
import { headers } from 'next/headers';
import { AboutSection } from '@/components/AboutSection';
import { Amenities } from '@/components/Amenities';
import { BookingSection } from '@/components/BookingSection';
import { ContactSection } from '@/components/ContactSection';
import { FAQSection } from '@/components/FAQSection';
import { FloatingCTA } from '@/components/FloatingCTA';
import { Footer } from '@/components/Footer';
import { Gallery } from '@/components/Gallery';
import { Hero } from '@/components/Hero';
import { LocationSection } from '@/components/LocationSection';
import { Navbar } from '@/components/Navbar';
import { PoliciesSection } from '@/components/PoliciesSection';
import { Reviews } from '@/components/Reviews';
import { RoomShowcase } from '@/components/RoomShowcase';
import { siteInfo } from '@/lib/data';

export const dynamic = 'force-dynamic';

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'LodgingBusiness',
  name: siteInfo.name,
  description: siteInfo.shortDescription,
  image: 'https://www.hasmmat-residence.com/images/hasmmatres62/PHOTO-2026-04-11-00-10-02_4.jpg',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '62 Cross Flatts Grove',
    addressLocality: 'Leeds',
    addressRegion: 'West Yorkshire',
    postalCode: 'LS11',
    addressCountry: 'GB'
  },
  telephone: siteInfo.phone,
  url: 'https://www.hasmmat-residence.com',
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
        <div className="rounded-[3rem] border border-white/10 bg-black/50 p-8 shadow-soft backdrop-blur-xl">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-brand-300">Book direct & feel the difference</p>
              <h2 className="mt-4 text-3xl font-semibold text-white">Skip the platform fees and book straight with Hasmmat Residence.</h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-brand-200">
                Enjoy real-time availability, flexibility for long stays, contractor-friendly rates, and simple bank-transfer deposits from our luxury Leeds home.
              </p>
            </div>
            <div className="grid gap-4 rounded-[2rem] bg-brand-950/90 p-6 text-brand-100">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span>Public direct saving</span>
                <strong>5%</strong>
              </div>
              <div className="flex items-center justify-between border-b border-white/10 pb-4 pt-4">
                <span>Early check-in requests</span>
                <strong>Available</strong>
              </div>
              <div className="flex items-center justify-between pt-4">
                <span>Long stay discounts</span>
                <strong>28+ nights</strong>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="container pb-8 pt-2">
        <div className="rounded-[2rem] border border-white/10 bg-brand-950/90 p-6 text-brand-100 shadow-soft backdrop-blur-xl">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.22em] text-brand-300">For project teams</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Contractor Accommodation in Leeds</h2>
              <p className="mt-3 text-base leading-8 text-brand-200">
                Spacious 4-bedroom accommodation for contractors, engineers, tradespeople and business travellers working across Leeds and South Leeds.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/contractor-accommodation-leeds"
                className="inline-flex items-center justify-center rounded-full bg-brand-400 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-300"
              >
                Explore contractor stays
              </Link>
              <a
                href="#booking"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-brand-100 transition hover:border-brand-300 hover:text-white"
              >
                Check availability
              </a>
            </div>
          </div>
        </div>
      </section>
      <section className="container pb-8 pt-2">
        <div className="rounded-[2rem] border border-white/10 bg-black/50 p-6 text-brand-100 shadow-soft backdrop-blur-xl">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.22em] text-brand-300">For families, friends and groups</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Group Accommodation in Leeds</h2>
              <p className="mt-3 text-base leading-8 text-brand-200">
                Stay together in our 4-bedroom South Leeds property, sleeping up to 8 guests with parking, Wi-Fi, kitchen and shared living space.
              </p>
            </div>
            <Link
              href="/group-accommodation-leeds"
              className="inline-flex items-center justify-center rounded-full bg-brand-400 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-300"
            >
              Explore group stays
            </Link>
          </div>
        </div>
      </section>
      <Gallery />
      <Amenities />
      <RoomShowcase />
      <BookingSection />
      <Reviews />
      <LocationSection />
      <AboutSection />
      <FAQSection />
      <PoliciesSection />
      <ContactSection />
      <Footer />
      <FloatingCTA />
    </main>
  );
}
