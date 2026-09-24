import React from 'react';
import Link from 'next/link';
import type { CheckoutReturnDetails, CheckoutReturnState } from '@/lib/stripeCheckoutReturn';
import { siteInfo } from '@/lib/data';

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00.000Z`));
}

function formatAmount(amountCents: number) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amountCents / 100);
}

function BookingSummary({ details }: { details: CheckoutReturnDetails }) {
  const rows = [
    ['Check-in date', formatDate(details.checkIn)],
    ['Check-out date', formatDate(details.checkOut)],
    ['Guest count', `${details.guests}`],
    ['Booking type', details.bookingType],
    ['Amount paid', formatAmount(details.amountPaidCents)],
  ];

  return (
    <dl className="mt-8 divide-y divide-white/10 rounded-[2rem] border border-white/10 bg-black/30 px-6">
      {rows.map(([label, value]) => (
        <div key={label} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
          <dt className="text-sm text-brand-300">{label}</dt>
          <dd className="font-semibold text-white">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function PaymentSuccessPanel({ state }: { state: CheckoutReturnState }) {
  if (state.status === 'paid') {
    const emailMessage =
      state.confirmationEmail === 'sent'
        ? 'A confirmation email has been sent to your email address.'
        : 'Your reservation is still being processed. A confirmation email will be sent once processing completes.';

    return (
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-emerald-300/30 bg-black/60 p-8 shadow-soft sm:p-10">
        <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">Payment received</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">Your booking has been received</h1>
        <p className="mt-5 leading-8 text-brand-100">Stripe has confirmed your payment. {emailMessage}</p>
        <BookingSummary details={state.details} />
        <Link href="/" className="mt-8 inline-flex rounded-full bg-brand-400 px-7 py-3 font-semibold text-white transition hover:bg-brand-300">
          Back to Hasmmat Residence
        </Link>
      </div>
    );
  }

  if (state.status === 'pending') {
    return (
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-amber-300/30 bg-black/60 p-8 shadow-soft sm:p-10">
        <p className="text-sm uppercase tracking-[0.25em] text-amber-300">Payment processing</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">We are checking your payment</h1>
        <p className="mt-5 leading-8 text-brand-100">
          Stripe has not confirmed this Checkout Session as paid, so your booking is not yet confirmed. Please check again shortly or contact us before attempting another payment.
        </p>
        <BookingSummary details={state.details} />
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="inline-flex rounded-full bg-brand-400 px-7 py-3 font-semibold text-white transition hover:bg-brand-300">
            Back to Hasmmat Residence
          </Link>
          <a href={`mailto:${siteInfo.email}`} className="inline-flex rounded-full border border-white/20 px-7 py-3 font-semibold text-brand-100 transition hover:border-brand-300 hover:text-white">
            Contact us
          </a>
        </div>
      </div>
    );
  }

  const missing = state.status === 'missing';
  const unavailable = state.status === 'unavailable';
  const heading = missing
    ? 'No payment session was provided'
    : unavailable
      ? 'Payment verification is temporarily unavailable'
      : 'We could not verify this payment';
  const message = unavailable
    ? 'We cannot safely confirm the payment status right now. Please try again shortly or contact us for help.'
    : 'No successful payment has been confirmed from this page. Please return to the website or contact us if you believe you completed payment.';

  return (
    <div className="mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-black/60 p-8 shadow-soft sm:p-10">
      <p className="text-sm uppercase tracking-[0.25em] text-brand-300">Payment not verified</p>
      <h1 className="mt-4 text-4xl font-semibold text-white">{heading}</h1>
      <p className="mt-5 leading-8 text-brand-100">{message}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className="inline-flex rounded-full bg-brand-400 px-7 py-3 font-semibold text-white transition hover:bg-brand-300">
          Back to Hasmmat Residence
        </Link>
        <a href={`mailto:${siteInfo.email}`} className="inline-flex rounded-full border border-white/20 px-7 py-3 font-semibold text-brand-100 transition hover:border-brand-300 hover:text-white">
          Contact us
        </a>
      </div>
    </div>
  );
}
