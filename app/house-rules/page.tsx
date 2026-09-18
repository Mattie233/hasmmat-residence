import type { Metadata } from 'next';
import Link from 'next/link';
import { FloatingCTA } from '@/components/FloatingCTA';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { PoliciesSection } from '@/components/PoliciesSection';

export const metadata: Metadata = {
  title: 'House Rules and Policies | Hasmmat Residence Leeds',
  description: 'Read the house rules, booking terms, cancellation policy and pricing guidance for Hasmmat Residence.'
};

export default function HouseRulesPage() {
  return (
    <main className="relative overflow-hidden bg-[#090707] text-brand-100">
      <Navbar />
      <section className="container pt-36 pb-10 text-center">
        <p className="text-sm uppercase tracking-[0.25em] text-brand-300">Please read before enquiring</p>
        <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">House Rules and Policies</h1>
        <p className="mx-auto mt-5 max-w-2xl leading-8 text-brand-200">
          Review the house rules, booking terms and cancellation information before sending an enquiry.
        </p>
        <Link href="/enquire" className="mt-8 inline-flex rounded-full bg-brand-400 px-7 py-3 text-sm font-semibold text-white transition hover:bg-brand-300">
          Send an Enquiry
        </Link>
      </section>
      <PoliciesSection />
      <Footer />
      <FloatingCTA />
    </main>
  );
}
