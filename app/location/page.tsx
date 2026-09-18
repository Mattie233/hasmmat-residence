import type { Metadata } from 'next';
import Link from 'next/link';
import { FloatingCTA } from '@/components/FloatingCTA';
import { Footer } from '@/components/Footer';
import { LocationSection } from '@/components/LocationSection';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Location | Hasmmat Residence Leeds',
  description: 'Find Hasmmat Residence in Beeston, South Leeds, with directions and nearby places including Elland Road and White Rose Shopping Centre.'
};

export default function LocationPage() {
  return (
    <main className="relative overflow-hidden bg-[#090707] text-brand-100">
      <Navbar />
      <section className="container pt-36 pb-10 text-center">
        <p className="text-sm uppercase tracking-[0.25em] text-brand-300">Beeston, South Leeds</p>
        <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Find Hasmmat Residence</h1>
        <p className="mx-auto mt-5 max-w-2xl leading-8 text-brand-200">
          Use the map and local travel information to plan your stay. White Rose Shopping Centre is approximately a 7-minute drive from the property.
        </p>
        <Link href="/enquire" className="mt-8 inline-flex rounded-full bg-brand-400 px-7 py-3 text-sm font-semibold text-white transition hover:bg-brand-300">
          Send an Enquiry
        </Link>
      </section>
      <LocationSection />
      <Footer />
      <FloatingCTA />
    </main>
  );
}
