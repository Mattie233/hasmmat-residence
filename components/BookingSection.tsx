'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { usePricing } from '@/hooks/usePricing';
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
  const bookingType: BookingType = 'flexible';
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

  const currentMonth = useMemo(() => startOfMonth(new Date()), []);
  const calendarDays = useMemo(() => getCalendarDays(visibleMonth), [visibleMonth]);
  const checkInDate = useMemo(() => parseDateKey(checkIn), [checkIn]);
  const checkOutDate = useMemo(() => parseDateKey(checkOut), [checkOut]);
  const canGoToPreviousMonth = visibleMonth.getTime() > currentMonth.getTime();

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

    setStatus('Send your dates through the contact form and we will confirm the deposit and bank transfer details.');
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="booking" className="container py-24">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-4 inline-flex rounded-full border border-brand-300/20 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.27em] text-brand-200">
          Book Direct & Save
        </p>
        <h2 className="text-4xl font-semibold text-white">Secure your stay with flexible rates and transparent pricing</h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-brand-200">
          Choose your dates, set guest numbers, and check live Smoobu availability before sending a direct booking request.
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
                  ? 'Checking Smoobu availability...'
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
              <p className="mt-2 text-sm text-brand-300">Extra guest fee after 4 guests.</p>
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
                <span>Live Smoobu check</span>
                <span>{pricing?.savingsLabel ?? 'Real-time rate update'}</span>
              </div>
              <div className="mt-5 space-y-4 text-brand-200">
                <div className="flex items-center justify-between">
                  <span>Smoobu stay price</span>
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
                Availability and price are checked against Smoobu before you send a request.
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
