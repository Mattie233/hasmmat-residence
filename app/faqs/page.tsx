import type { Metadata } from 'next';
import Link from 'next/link';
import { FAQSection } from '@/components/FAQSection';
import { FloatingCTA } from '@/components/FloatingCTA';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'FAQs | Hasmmat Residence Leeds',
  description: 'Find answers to common questions about staying at Hasmmat Residence in Leeds.'
};

export default function FAQsPage() {
  return (
    <main className="relative overflow-hidden bg-[#090707] text-brand-100">
      <Navbar />
      <section className="container pt-36 pb-10 text-center">
        <p className="text-sm uppercase tracking-[0.25em] text-brand-300">Before your stay</p>
        <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Frequently Asked Questions</h1>
        <p className="mx-auto mt-5 max-w-2xl leading-8 text-brand-200">
          Find practical answers before sending your dates and requirements.
        </p>
        <Link href="/enquire" className="mt-8 inline-flex rounded-full bg-brand-400 px-7 py-3 text-sm font-semibold text-white transition hover:bg-brand-300">
          Enquire or Book
        </Link>
      </section>
      <FAQSection />
      <Footer />
      <FloatingCTA />
    </main>
  );
}
