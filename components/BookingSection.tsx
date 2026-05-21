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

  const handleBookingRequest = () => {
    if (!checkIn || !checkOut || nights < 1 || !pricing?.valid) {
      setStatus('Select valid dates and guest count.');
      return;
    }

    setStatus('Send your dates through the contact form and we will confirm the deposit and bank transfer details.');
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
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
              <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white">
                <button
                  type="button"
                  onClick={() => setGuests((current) => Math.max(MIN_GUESTS, current - 1))}
                  disabled={guests <= MIN_GUESTS}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-xl leading-none text-brand-100 transition hover:border-brand-300 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Decrease guests"
                >
                  -
                </button>
                <div className="text-center">
                  <p className="text-2xl font-semibold">{guests}</p>
                  <p className="text-xs uppercase tracking-[0.18em] text-brand-300">
                    Guest{guests !== 1 ? 's' : ''}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setGuests((current) => Math.min(MAX_GUESTS, current + 1))}
                  disabled={guests >= MAX_GUESTS}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-xl leading-none text-brand-100 transition hover:border-brand-300 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Increase guests"
                >
                  +
                </button>
              </div>
              <p className="mt-2 text-sm text-brand-300">Extra guest fee after 4 guests.</p>
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
                <span>Deposit by bank transfer</span>
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
              onClick={handleBookingRequest}
              disabled={!pricing?.valid || loading}
              className="w-full rounded-full bg-brand-400 px-6 py-4 text-sm font-semibold text-white transition hover:bg-brand-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Updating price…' : 'Send booking request'}
            </button>
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 text-sm leading-6 text-brand-200">
              <p className="font-semibold text-white">No online card payment is taken on this website.</p>
              <p className="mt-2">
                Once your stay is confirmed, we provide bank details for the deposit and remaining balance.
                Use your name and stay dates as the payment reference.
              </p>
            </div>
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
