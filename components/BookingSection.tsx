'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { usePricing } from '@/hooks/usePricing';
import type { BookingType } from '@/types';

const MIN_GUESTS = 1;
const MAX_GUESTS = 8;

export function BookingSection() {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [bookingType, setBookingType] = useState<BookingType>('flexible');
  const [status, setStatus] = useState<string | null>(null);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const ms = end.getTime() - start.getTime();
    return ms > 0 ? Math.round(ms / (1000 * 60 * 60 * 24)) : 0;
  }, [checkIn, checkOut]);

  const { pricing, loading, error } = usePricing({
    checkIn,
    checkOut,
    guests,
    bookingType,
  });

  const handleCheckout = async () => {
    if (!checkIn || !checkOut || nights < 1 || !pricing?.valid) {
      setStatus('Select valid dates and guest count.');
      return;
    }

    setStatus('Preparing checkout...');

    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        checkIn,
        checkOut,
        guests,
        bookingType,
        pricing,
      }),
    });

    const data = await response.json();

    if (data.url) {
      window.location.href = data.url;
      return;
    }

    setStatus(data.error || 'Unable to start checkout. Please try again.');
  };

  const bestValueLabel = bookingType === 'nonrefundable' ? 'Best value for savings' : 'Flexible booking';

  return (
    <section id="booking" className="container py-24">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-4 inline-flex rounded-full border border-brand-300/20 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.27em] text-brand-200">
          Book Direct & Save
        </p>
        <h2 className="text-4xl font-semibold text-white">Secure your stay with flexible rates and transparent pricing</h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-brand-200">
          Choose your dates, set guest numbers, and see the total instantly. Direct booking discounts, seasonal PriceLabs rates, and real-time comparison to Airbnb are built in.
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1.3fr_0.9fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-[2rem] border border-white/10 bg-black/50 p-8 shadow-soft backdrop-blur-xl"
        >
          <div className="space-y-6">
            <div>
              <label className="mb-3 block text-sm uppercase tracking-[0.2em] text-brand-300">Check-in</label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none transition focus:border-brand-300"
              />
            </div>
            <div>
              <label className="mb-3 block text-sm uppercase tracking-[0.2em] text-brand-300">Check-out</label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none transition focus:border-brand-300"
              />
            </div>
            <div>
              <label className="mb-3 block text-sm uppercase tracking-[0.2em] text-brand-300">Guests</label>
              <input
                type="range"
                min={MIN_GUESTS}
                max={MAX_GUESTS}
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full"
              />
              <div className="mt-2 flex items-center justify-between text-brand-100">
                <span>{guests} Guest{guests !== 1 ? 's' : ''}</span>
                <span>Extra fee applies after 4 guests</span>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                onClick={() => setBookingType('flexible')}
                className={`rounded-3xl border px-4 py-3 text-sm font-semibold transition ${
                  bookingType === 'flexible'
                    ? 'border-brand-300 bg-brand-300/10 text-white'
                    : 'border-white/10 bg-white/5 text-brand-100'
                }`}
              >
                Flexible
              </button>
              <button
                onClick={() => setBookingType('nonrefundable')}
                className={`rounded-3xl border px-4 py-3 text-sm font-semibold transition ${
                  bookingType === 'nonrefundable'
                    ? 'border-brand-300 bg-brand-300/10 text-white'
                    : 'border-white/10 bg-white/5 text-brand-100'
                }`}
              >
                Non-refundable
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="rounded-[2rem] border border-white/10 bg-brand-950/90 p-8 shadow-soft backdrop-blur-xl"
        >
          <div className="space-y-6 text-brand-100">
            <div className="rounded-[2rem] bg-white/5 p-6">
              <div className="flex items-center justify-between text-sm uppercase tracking-[0.2em] text-brand-300">
                <span>{bestValueLabel}</span>
                <span>{pricing?.savingsLabel ?? 'Real-time rate update'}</span>
              </div>
              <div className="mt-5 space-y-4 text-brand-200">
                <div className="flex items-center justify-between">
                  <span>Nightly rate total</span>
                  <span>£{pricing ? pricing.rateTotal : '--'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Airbnb comparison</span>
                  <span>£{pricing ? pricing.airbnbTotal : '--'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Cleaning fee</span>
                  <span>£{pricing ? pricing.cleaningFee : '60'}</span>
                </div>
                {pricing?.extraGuestFeeTotal ? (
                  <div className="flex items-center justify-between text-emerald-300">
                    <span>Extra guest fee</span>
                    <span>£{pricing.extraGuestFeeTotal}</span>
                  </div>
                ) : null}
                {pricing?.discountAmount ? (
                  <div className="flex items-center justify-between text-emerald-300">
                    <span>Direct booking discount</span>
                    <span>-£{pricing.discountAmount}</span>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="rounded-[2rem] bg-brand-900/80 p-6 text-white">
              <div className="flex items-center justify-between text-sm uppercase tracking-[0.2em] text-brand-300">
                <span>Total price</span>
                <span>Includes estimate</span>
              </div>
              <p className="mt-4 text-4xl font-semibold">
                {loading ? 'Loading…' : `£${pricing?.totalAfterDiscount?.toFixed(0) ?? '0'}`}
              </p>
              <p className="mt-3 text-sm leading-6 text-brand-200">
                Booking for {guests} guest{guests !== 1 ? 's' : ''} across {nights || '0'} night{nights !== 1 ? 's' : ''}.{' '}
                {bookingType === 'nonrefundable' ? 'Non-refundable savings applied.' : 'Flexible cancellation available.'}
              </p>
            </div>

            <button
              onClick={handleCheckout}
              disabled={!pricing?.valid || loading}
              className="w-full rounded-full bg-brand-400 px-6 py-4 text-sm font-semibold text-white transition hover:bg-brand-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Updating price…' : 'Proceed to Stripe Checkout'}
            </button>
            <p className="text-center text-sm text-brand-200">Secure payment, instant confirmation, and responsive guest support.</p>
            {pricing?.fallbackUsed ? (
              <p className="text-sm text-amber-200">Pricing is using temporarily cached fallback values.</p>
            ) : null}
            {error ? <p className="text-sm text-amber-200">{error}</p> : null}
            {status ? <p className="text-sm text-brand-200">{status}</p> : null}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
