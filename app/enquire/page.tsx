import type { Metadata } from 'next';
import Link from 'next/link';
import { BookingSection } from '@/components/BookingSection';
import { ContactSection } from '@/components/ContactSection';
import { FloatingCTA } from '@/components/FloatingCTA';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Send an Enquiry | Hasmmat Residence Leeds',
  description: 'Check live availability and send an enquiry for your stay at Hasmmat Residence in Leeds.'
};

export default function EnquirePage() {
  return (
    <main className="relative overflow-hidden bg-[#090707] text-brand-100">
      <Navbar />
      <section className="container pt-36 pb-10 text-center">
        <p className="text-sm uppercase tracking-[0.25em] text-brand-300">Plan your stay</p>
        <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Send an Enquiry</h1>
        <p className="mx-auto mt-5 max-w-2xl leading-8 text-brand-200">
          Check your dates and guest details, then send your requirements for confirmation.
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-brand-300">
          Please review the <Link href="/house-rules" className="underline underline-offset-4 hover:text-white">House Rules and Policies</Link> before enquiring.
        </p>
      </section>
      <BookingSection />
      <ContactSection />
      <Footer />
      <FloatingCTA />
    </main>
  );
}
