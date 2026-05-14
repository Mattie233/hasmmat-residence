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
import { Reviews } from '@/components/Reviews';
import { RoomShowcase } from '@/components/RoomShowcase';
import { siteInfo } from '@/lib/data';

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'LodgingBusiness',
  name: siteInfo.name,
  description: siteInfo.shortDescription,
  image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Leeds',
    addressRegion: 'West Yorkshire',
    postalCode: 'LS11',
    addressCountry: 'GB'
  },
  telephone: '+447700900123',
  url: 'https://www.hasmmat-residence.com',
  priceRange: '£220+',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5',
    reviewCount: '124'
  },
  sameAs: ['https://www.facebook.com/', 'https://www.instagram.com/']
};

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <Navbar />
      <Hero />
      <section className="container py-16">
        <div className="rounded-[3rem] border border-white/10 bg-black/50 p-8 shadow-soft backdrop-blur-xl">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-brand-300">Book direct & feel the difference</p>
              <h2 className="mt-4 text-3xl font-semibold text-white">Skip the platform fees and book straight with Hasmmat Residence.</h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-brand-200">
                Enjoy real-time availability, flexibility for long stays, contractor-friendly rates, and secure Stripe checkout from our luxury Leeds home.
              </p>
            </div>
            <div className="grid gap-4 rounded-[2rem] bg-brand-950/90 p-6 text-brand-100">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span>Direct book savings</span>
                <strong>Up to 20%</strong>
              </div>
              <div className="flex items-center justify-between border-b border-white/10 pb-4 pt-4">
                <span>Early check-in requests</span>
                <strong>Available</strong>
              </div>
              <div className="flex items-center justify-between pt-4">
                <span>Long stay discounts</span>
                <strong>7+ nights</strong>
              </div>
            </div>
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
      <ContactSection />
      <Footer />
      <FloatingCTA />
    </main>
  );
}
