'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { usePricing } from '@/hooks/usePricing';
import { BOOKING_REQUEST_EVENT, type BookingRequestDetail, type GuestBookingDetails } from '@/lib/bookingRequest';
import type { BookingType, CalendarAvailabilityDay, CalendarAvailabilityResponse } from '@/types';

const MIN_GUESTS = 1;
const MAX_GUESTS = 8;
const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

const monthFormatter = new Intl.DateTimeFormat('en-GB', {
  month: 'long',
  year: 'numeric',
});

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
});

type DateField = 'checkIn' | 'checkOut';
function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseDateKey(value: string) {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function getCalendarDays(month: Date) {
  const monthStart = startOfMonth(month);
  const mondayOffset = (monthStart.getDay() + 6) % 7;
  const gridStart = new Date(monthStart);
  gridStart.setDate(monthStart.getDate() - mondayOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    return date;
  });
}

function isBeforeToday(date: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date.getTime() < today.getTime();
}

function formatDisplayDate(value: string, fallback: string) {
  const date = parseDateKey(value);
  return date ? dateFormatter.format(date) : fallback;
}

export function BookingSection() {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [activeDateField, setActiveDateField] = useState<DateField>('checkIn');
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(new Date()));
  const [availability, setAvailability] = useState<Record<string, CalendarAvailabilityDay>>({});
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const [guests, setGuests] = useState(2);
  const [bookingType, setBookingType] = useState<BookingType>('flexible');
  const [status, setStatus] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [guestDetails, setGuestDetails] = useState<GuestBookingDetails>({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    guestAddress: '',
    specialRequests: '',
  });
  const [termsAccepted, setTermsAccepted] = useState(false);

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

  const currentMonth = useMemo(() => startOfMonth(new Date()), []);
  const calendarDays = useMemo(() => getCalendarDays(visibleMonth), [visibleMonth]);
  const checkInDate = useMemo(() => parseDateKey(checkIn), [checkIn]);
  const checkOutDate = useMemo(() => parseDateKey(checkOut), [checkOut]);
  const canGoToPreviousMonth = visibleMonth.getTime() > currentMonth.getTime();
  const hasGuestDetails = Boolean(
    guestDetails.guestName.trim() &&
      guestDetails.guestEmail.includes('@') &&
      guestDetails.guestPhone.trim() &&
      termsAccepted,
  );

  useEffect(() => {
    const controller = new AbortController();
    const startDate = toDateKey(calendarDays[0]);
    const endDate = toDateKey(calendarDays[calendarDays.length - 1]);

    const fetchAvailability = async () => {
      setAvailabilityLoading(true);
      setAvailabilityError(null);

      try {
        const response = await fetch(`/api/availability?startDate=${startDate}&endDate=${endDate}`, {
          signal: controller.signal,
        });
        const data = (await response.json()) as CalendarAvailabilityResponse & { error?: string };

        if (!response.ok || data.error) {
          throw new Error(data.error || 'Unable to load availability.');
        }

        setAvailability(data.days);
      } catch (fetchError) {
        if (fetchError instanceof DOMException && fetchError.name === 'AbortError') {
          return;
        }

        setAvailability({});
        setAvailabilityError(fetchError instanceof Error ? fetchError.message : 'Availability unavailable.');
      } finally {
        if (!controller.signal.aborted) {
          setAvailabilityLoading(false);
        }
      }
    };

    fetchAvailability();

    return () => controller.abort();
  }, [calendarDays]);

  const handleDateSelect = (date: Date) => {
    if (isBeforeToday(date)) return;

    const selectedKey = toDateKey(date);
    const dayAvailability = availability[selectedKey];
    const checkInUnavailable = dayAvailability?.checkInAvailable === false;

    if (activeDateField === 'checkIn') {
      if (checkInUnavailable) return;

      setCheckIn(selectedKey);

      if (checkOutDate && date.getTime() >= checkOutDate.getTime()) {
        setCheckOut('');
      }

      setActiveDateField('checkOut');
      return;
    }

    if (!checkInDate || date.getTime() <= checkInDate.getTime()) {
      setCheckIn(selectedKey);
      setCheckOut('');
      setActiveDateField('checkOut');
      return;
    }

    setCheckOut(selectedKey);
    setActiveDateField('checkIn');
  };

  const handleBookingRequest = () => {
    if (!checkIn || !checkOut || nights < 1 || !pricing?.valid) {
      setStatus('Select valid dates and guest count.');
      return;
    }

    const detail: BookingRequestDetail = {
      checkIn,
      checkOut,
      guests,
      nights,
      bookingType,
      total: pricing.totalAfterDiscount,
      savingsLabel: pricing.savingsLabel,
    };

    window.dispatchEvent(new CustomEvent<BookingRequestDetail>(BOOKING_REQUEST_EVENT, { detail }));
    setStatus('Your booking details have been added to the contact form.');
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleStripeCheckout = async () => {
    if (!checkIn || !checkOut || nights < 1 || !pricing?.valid) {
      setStatus('Select valid dates and guest count before payment.');
      return;
    }

    if (!hasGuestDetails) {
      setStatus('Enter your name, email, phone number, and accept the booking terms before payment.');
      return;
    }

    setCheckoutLoading(true);
    setStatus(null);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checkIn,
          checkOut,
          guests,
          nights,
          bookingType,
          total: pricing.totalAfterDiscount,
          savingsLabel: pricing.savingsLabel,
          ...guestDetails,
        }),
      });
      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || data.error || !data.url) {
        throw new Error(data.error || 'Unable to start card payment.');
      }

      window.location.href = data.url;
    } catch (checkoutError) {
      setStatus(checkoutError instanceof Error ? checkoutError.message : 'Unable to start card payment.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <section id="booking" className="container py-24">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-4 inline-flex rounded-full border border-brand-300/20 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.27em] text-brand-200">
          Book Direct & Save
        </p>
        <h2 className="text-4xl font-semibold text-white">Secure your stay with flexible rates and transparent pricing</h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-brand-200">
          Choose your dates, set guest numbers, and check live availability before sending a direct booking request.
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
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setActiveDateField('checkIn')}
                  className={`rounded-[1.5rem] border p-4 text-left transition ${
                    activeDateField === 'checkIn'
                      ? 'border-brand-300 bg-brand-300/10 text-white'
                      : 'border-white/10 bg-black/20 text-brand-100 hover:border-white/20'
                  }`}
                >
                  <span className="text-xs uppercase tracking-[0.2em] text-brand-300">Check-in</span>
                  <span className="mt-2 block text-xl font-semibold">{formatDisplayDate(checkIn, 'Choose date')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDateField('checkOut')}
                  className={`rounded-[1.5rem] border p-4 text-left transition ${
                    activeDateField === 'checkOut'
                      ? 'border-brand-300 bg-brand-300/10 text-white'
                      : 'border-white/10 bg-black/20 text-brand-100 hover:border-white/20'
                  }`}
                >
                  <span className="text-xs uppercase tracking-[0.2em] text-brand-300">Check-out</span>
                  <span className="mt-2 block text-xl font-semibold">{formatDisplayDate(checkOut, 'Choose date')}</span>
                </button>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setVisibleMonth((current) => addMonths(current, -1))}
                    disabled={!canGoToPreviousMonth}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-brand-100 transition hover:border-brand-300 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label="Previous month"
                  >
                    &lt;
                  </button>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white">
                    {monthFormatter.format(visibleMonth)}
                  </p>
                  <button
                    type="button"
                    onClick={() => setVisibleMonth((current) => addMonths(current, 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-brand-100 transition hover:border-brand-300 hover:text-white"
                    aria-label="Next month"
                  >
                    &gt;
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs uppercase tracking-[0.16em] text-brand-300">
                  {WEEKDAYS.map((weekday) => (
                    <span key={weekday}>{weekday}</span>
                  ))}
                </div>

                <div className="mt-3 grid grid-cols-7 gap-2">
                  {calendarDays.map((date) => {
                    const dateKey = toDateKey(date);
                    const dayAvailability = availability[dateKey];
                    const isUnavailable = dayAvailability?.checkInAvailable === false;
                    const disabled =
                      isBeforeToday(date) ||
                      (activeDateField === 'checkIn' && isUnavailable) ||
                      (activeDateField === 'checkOut' &&
                        !!checkInDate &&
                        date.getTime() <= checkInDate.getTime());
                    const isCurrentMonth = date.getMonth() === visibleMonth.getMonth();
                    const isCheckIn = dateKey === checkIn;
                    const isCheckOut = dateKey === checkOut;
                    const isInRange =
                      !!checkInDate &&
                      !!checkOutDate &&
                      date.getTime() > checkInDate.getTime() &&
                      date.getTime() < checkOutDate.getTime();

                    return (
                      <button
                        key={dateKey}
                        type="button"
                        onClick={() => handleDateSelect(date)}
                        disabled={disabled}
                        className={`h-10 rounded-2xl text-sm transition ${
                          isCheckIn || isCheckOut
                            ? 'bg-brand-300 text-brand-950'
                            : isUnavailable
                              ? 'bg-white/[0.03] text-brand-500 line-through'
                            : isInRange
                              ? 'bg-brand-300/10 text-white'
                              : isCurrentMonth
                                ? 'text-brand-100 hover:bg-white/10'
                                : 'text-brand-500 hover:bg-white/5'
                        } ${disabled ? 'cursor-not-allowed opacity-25' : ''}`}
                        aria-label={dateFormatter.format(date)}
                        aria-pressed={isCheckIn || isCheckOut}
                      >
                        {date.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>

              <p className="mt-4 text-sm text-brand-300">
                {availabilityLoading
                  ? 'Checking availability...'
                  : availabilityError
                    ? availabilityError
                    : activeDateField === 'checkIn'
                      ? 'Select your arrival date. Grey dates cannot be used for check-in.'
                      : 'Select your departure date. Turnover days can be selected.'}
              </p>
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
              <p className="mt-2 text-sm text-brand-300">£20 per extra guest after 4 guests, added to the stay price.</p>
            </div>

            <div>
              <p className="mb-3 text-sm uppercase tracking-[0.2em] text-brand-300">Booking type</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setBookingType('flexible')}
                  className={`rounded-[1.5rem] border p-4 text-left transition ${
                    bookingType === 'flexible'
                      ? 'border-brand-300 bg-brand-300/10 text-white'
                      : 'border-white/10 bg-white/5 text-brand-100 hover:border-white/20'
                  }`}
                >
                  <span className="text-sm font-semibold">Refundable</span>
                  <span className="mt-2 block text-xs leading-5 text-brand-300">Standard direct rate with the published cancellation policy.</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBookingType('nonrefundable')}
                  className={`rounded-[1.5rem] border p-4 text-left transition ${
                    bookingType === 'nonrefundable'
                      ? 'border-brand-300 bg-brand-300/10 text-white'
                      : 'border-white/10 bg-white/5 text-brand-100 hover:border-white/20'
                  }`}
                >
                  <span className="text-sm font-semibold">Non-refundable</span>
                  <span className="mt-2 block text-xs leading-5 text-brand-300">Discounted rate with no refund after payment.</span>
                </button>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5">
              <p className="mb-4 text-sm uppercase tracking-[0.2em] text-brand-300">Guest details</p>
              <div className="grid gap-4">
                <label className="grid gap-2 text-sm text-brand-200">
                  Full name
                  <input
                    value={guestDetails.guestName}
                    onChange={(event) => setGuestDetails((current) => ({ ...current, guestName: event.target.value }))}
                    className="rounded-3xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-brand-300"
                    placeholder="Lead guest name"
                  />
                </label>
                <label className="grid gap-2 text-sm text-brand-200">
                  Email for confirmation
                  <input
                    type="email"
                    value={guestDetails.guestEmail}
                    onChange={(event) => setGuestDetails((current) => ({ ...current, guestEmail: event.target.value }))}
                    className="rounded-3xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-brand-300"
                    placeholder="you@example.com"
                  />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm text-brand-200">
                    Phone or WhatsApp
                    <input
                      value={guestDetails.guestPhone}
                      onChange={(event) => setGuestDetails((current) => ({ ...current, guestPhone: event.target.value }))}
                      className="rounded-3xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-brand-300"
                      placeholder="+44..."
                    />
                  </label>
                  <label className="grid gap-2 text-sm text-brand-200">
                    Address
                    <input
                      value={guestDetails.guestAddress}
                      onChange={(event) => setGuestDetails((current) => ({ ...current, guestAddress: event.target.value }))}
                      className="rounded-3xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-brand-300"
                      placeholder="Optional"
                    />
                  </label>
                </div>
                <label className="grid gap-2 text-sm text-brand-200">
                  Notes for your stay
                  <textarea
                    value={guestDetails.specialRequests}
                    onChange={(event) => setGuestDetails((current) => ({ ...current, specialRequests: event.target.value }))}
                    className="min-h-[104px] rounded-3xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-brand-300"
                    placeholder="Arrival time, contractor stay details, children, accessibility needs, or other requests."
                  />
                </label>
                <label className="flex items-start gap-3 rounded-3xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-brand-200">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(event) => setTermsAccepted(event.target.checked)}
                    className="mt-1 h-4 w-4 accent-brand-300"
                  />
                  <span>I confirm the details are correct and agree to the house rules, cancellation policy, and direct booking terms.</span>
                </label>
              </div>
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
                <span>Live availability</span>
                <span>{pricing?.savingsLabel ?? 'Real-time rate update'}</span>
              </div>
              <div className="mt-5 space-y-4 text-brand-200">
                <div className="flex items-center justify-between">
                  <span>Stay price</span>
                  <span>£{pricing ? pricing.rateTotal : '--'}</span>
                </div>
                {pricing?.cleaningFee ? (
                  <div className="flex items-center justify-between">
                    <span>Cleaning fee</span>
                    <span>£{pricing.cleaningFee}</span>
                  </div>
                ) : null}
                {pricing?.extraGuestFeeTotal ? (
                  <div className="flex items-center justify-between text-emerald-300">
                    <span>Extra guest fee</span>
                    <span>£{pricing.extraGuestFeeTotal}</span>
                  </div>
                ) : null}
                {pricing?.discountAmount ? (
                  <div className="flex items-center justify-between text-emerald-300">
                    <span>Direct booking discount ({Math.round(pricing.discountRate * 100)}%)</span>
                    <span>-£{pricing.discountAmount}</span>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="rounded-[2rem] bg-brand-900/80 p-6 text-white">
              <div className="flex items-center justify-between text-sm uppercase tracking-[0.2em] text-brand-300">
                <span>Total price</span>
                <span>Secure card payment</span>
              </div>
              <p className="mt-4 text-4xl font-semibold">
                {loading ? 'Loading…' : `£${pricing?.totalAfterDiscount?.toFixed(0) ?? '0'}`}
              </p>
              <p className="mt-3 text-sm leading-6 text-brand-200">
                Booking for {guests} guest{guests !== 1 ? 's' : ''} across {nights || '0'} night{nights !== 1 ? 's' : ''}.{' '}
                Availability and price are checked before you send a request.
              </p>
            </div>

            <button
              onClick={handleBookingRequest}
              disabled={!pricing?.valid || loading}
              className="w-full rounded-full border border-brand-300/40 px-6 py-4 text-sm font-semibold text-brand-100 transition hover:border-brand-100 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Updating price…' : 'Send booking request'}
            </button>
            <button
              onClick={handleStripeCheckout}
              disabled={!pricing?.valid || loading || checkoutLoading || !hasGuestDetails}
              className="w-full rounded-full bg-brand-400 px-6 py-4 text-sm font-semibold text-white transition hover:bg-brand-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {checkoutLoading ? 'Opening Stripe...' : 'Pay securely by card'}
            </button>
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 text-sm leading-6 text-brand-200">
              <p className="font-semibold text-white">Card payments are processed securely by Stripe.</p>
              <p className="mt-2">
                You can send an enquiry first, or continue to Stripe using the selected dates, guests, booking type,
                and quoted total shown above.
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
