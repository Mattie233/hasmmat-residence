import type { Metadata } from 'next';
import Link from 'next/link';
import { Amenities } from '@/components/Amenities';
import { FloatingCTA } from '@/components/FloatingCTA';
import { Footer } from '@/components/Footer';
import { Gallery } from '@/components/Gallery';
import { Navbar } from '@/components/Navbar';
import { RoomShowcase } from '@/components/RoomShowcase';

export const metadata: Metadata = {
  title: 'Accommodation | Hasmmat Residence Leeds',
  description: 'Explore the rooms, shared spaces and amenities at Hasmmat Residence, a stylish 4-bedroom stay in Leeds.'
};

export default function AccommodationPage() {
  return (
    <main className="relative overflow-hidden bg-[#090707] text-brand-100">
      <Navbar />
      <section className="container pt-36 pb-10 text-center">
        <p className="text-sm uppercase tracking-[0.25em] text-brand-300">The home</p>
        <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Stylish 4-Bedroom Stay in Leeds</h1>
        <p className="mx-auto mt-5 max-w-2xl leading-8 text-brand-200">
          See the bedrooms, lounge, shared spaces and practical amenities before you send an enquiry.
        </p>
        <Link href="/enquire" className="mt-8 inline-flex rounded-full bg-brand-400 px-7 py-3 text-sm font-semibold text-white transition hover:bg-brand-300">
          Send an Enquiry
        </Link>
      </section>
      <Gallery />
      <Amenities />
      <RoomShowcase />
      <Footer />
      <FloatingCTA />
    </main>
  );
}
