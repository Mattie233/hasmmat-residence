import type { Metadata } from 'next';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { PaymentSuccessPanel } from '@/components/PaymentSuccessPanel';
import { prisma } from '@/lib/db';
import { DEFAULT_SMOOBU_APARTMENT_ID } from '@/lib/env';
import { getCheckoutReturnState } from '@/lib/stripeCheckoutReturn';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Booking Payment Status | Hasmmat Residence',
  description: 'Securely verify the payment status of your Hasmmat Residence direct booking.',
};

type BookingSuccessPageProps = {
  searchParams?: {
    session_id?: string | string[];
  };
};

export default async function BookingSuccessPage({ searchParams }: BookingSuccessPageProps) {
  const sessionId = typeof searchParams?.session_id === 'string' ? searchParams.session_id : undefined;
  const configuredApartmentId = Number(process.env.SMOOBU_APARTMENT_ID || DEFAULT_SMOOBU_APARTMENT_ID);
  const state = await getCheckoutReturnState(sessionId, {
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    configuredApartmentId,
    confirmationLookup: async (stripeSessionId) => {
      const booking = await prisma.paidBooking.findUnique({
        where: { stripeSessionId },
        select: { confirmationSentAt: true },
      });

      return Boolean(booking?.confirmationSentAt);
    },
  });

  return (
    <main className="min-h-screen bg-[#090707] text-brand-100">
      <Navbar />
      <section className="container pb-24 pt-36">
        <PaymentSuccessPanel state={state} />
      </section>
      <Footer />
    </main>
  );
}
