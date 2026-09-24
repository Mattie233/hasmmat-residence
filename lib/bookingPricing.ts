import type { BookingType, PricingBreakdown, SmoobuAvailabilityResponse } from '@/types';
import { checkSmoobuAvailability } from '@/lib/smoobu';

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const INCLUDED_GUESTS = 4;
const EXTRA_GUEST_FEE = 20;
const DIRECT_BOOKING_DISCOUNT_RATE = 0.05;
const LAST_MINUTE_DISCOUNT_RATE = 0.08;
const NON_REFUNDABLE_DISCOUNT_RATE = 0.1;
const LONG_STAY_DISCOUNT_RATE = 0.12;
const LONG_STAY_MIN_NIGHTS = 28;
const LAST_MINUTE_DAYS = 7;
const MAX_BOOKING_NIGHTS = 63;

export type BookingInputs = {
  checkIn: string;
  checkOut: string;
  guests: number;
  bookingType: BookingType;
};

export type AuthoritativePricing = PricingBreakdown & {
  amountCents: number;
  currency: 'GBP';
};

export type VerifiedPaymentMetadata = {
  input: BookingInputs;
  amountCents: number;
  nights: number;
  rate: string;
};

function parseDateOnly(value: unknown, field: string) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(`Invalid ${field}.`);
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    throw new Error(`Invalid ${field}.`);
  }

  return date;
}

export function validateBookingInputs(input: {
  checkIn?: unknown;
  checkOut?: unknown;
  guests?: unknown;
  bookingType?: unknown;
}): BookingInputs {
  const checkInDate = parseDateOnly(input.checkIn, 'check-in date');
  const checkOutDate = parseDateOnly(input.checkOut, 'check-out date');
  const guests = Number(input.guests);
  const bookingType = input.bookingType;
  const nights = Math.round((checkOutDate.getTime() - checkInDate.getTime()) / MS_PER_DAY);

  if (!Number.isInteger(guests) || guests < 1 || guests > 8) {
    throw new Error('Guest count must be between 1 and 8.');
  }

  if (bookingType !== 'flexible' && bookingType !== 'nonrefundable') {
    throw new Error('Invalid booking type.');
  }

  if (nights < 1 || nights > MAX_BOOKING_NIGHTS) {
    throw new Error(`Stay must be between 1 and ${MAX_BOOKING_NIGHTS} nights.`);
  }

  return {
    checkIn: input.checkIn as string,
    checkOut: input.checkOut as string,
    guests,
    bookingType,
  };
}

export function verifyAuthoritativePaymentMetadata({
  metadata,
  amountTotal,
  currency,
  apartmentId,
  configuredApartmentId,
}: {
  metadata: Record<string, string>;
  amountTotal: number | null | undefined;
  currency: string | null | undefined;
  apartmentId: number;
  configuredApartmentId: number;
}): VerifiedPaymentMetadata {
  const input = validateBookingInputs({
    checkIn: metadata.checkIn,
    checkOut: metadata.checkOut,
    guests: metadata.guests,
    bookingType: metadata.bookingType,
  });
  const amountCents = Number(metadata.amountCents);
  const nights = Math.round((new Date(input.checkOut).getTime() - new Date(input.checkIn).getTime()) / MS_PER_DAY);

  if (
    metadata.currency?.toUpperCase() !== 'GBP' ||
    !Number.isInteger(amountCents) ||
    amountCents <= 0 ||
    amountTotal !== amountCents ||
    currency?.toLowerCase() !== 'gbp' ||
    apartmentId !== configuredApartmentId ||
    Number(metadata.nights) !== nights ||
    !metadata.rate
  ) {
    throw new Error('Invalid authoritative payment metadata.');
  }

  return {
    input,
    amountCents,
    nights,
    rate: metadata.rate,
  };
}

function getDiscount(checkIn: string, nights: number, bookingType: BookingType) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkInDate = new Date(checkIn);
  checkInDate.setHours(0, 0, 0, 0);
  const daysUntilCheckIn = Math.ceil((checkInDate.getTime() - today.getTime()) / MS_PER_DAY);

  if (nights >= LONG_STAY_MIN_NIGHTS) {
    return {
      rate: LONG_STAY_DISCOUNT_RATE,
      label: 'Long-stay direct rate',
    };
  }

  if (bookingType === 'nonrefundable') {
    return {
      rate: NON_REFUNDABLE_DISCOUNT_RATE,
      label: 'Non-refundable direct rate',
    };
  }

  if (daysUntilCheckIn >= 0 && daysUntilCheckIn <= LAST_MINUTE_DAYS) {
    return {
      rate: LAST_MINUTE_DISCOUNT_RATE,
      label: 'Last-minute direct rate',
    };
  }

  return {
    rate: DIRECT_BOOKING_DISCOUNT_RATE,
    label: 'Direct website rate',
  };
}

export function calculatePricingFromAvailability(
  input: BookingInputs,
  response: SmoobuAvailabilityResponse,
  apartmentId: number,
): AuthoritativePricing {
  const apartmentKey = `${apartmentId}`;
  const available = response.availableApartments?.includes(apartmentId) ?? false;
  const smoobuPrice = response.prices?.[apartmentKey];
  const nights = Math.round((new Date(input.checkOut).getTime() - new Date(input.checkIn).getTime()) / MS_PER_DAY);

  if (!available || !smoobuPrice) {
    const unavailableReason = response.errorMessages?.[apartmentKey]?.message;
    throw new Error(unavailableReason || 'This stay is not available for the selected dates.');
  }

  const smoobuStayPrice = Number(smoobuPrice.price);
  if (!Number.isFinite(smoobuStayPrice) || smoobuStayPrice < 0) {
    throw new Error('Smoobu returned an invalid stay price.');
  }

  const roundedStayPrice = Math.round(smoobuStayPrice * 100) / 100;
  const extraGuestFeeTotal = Math.max(0, input.guests - INCLUDED_GUESTS) * EXTRA_GUEST_FEE;
  const stayPrice = Math.round((roundedStayPrice + extraGuestFeeTotal) * 100) / 100;
  const discount = getDiscount(input.checkIn, nights, input.bookingType);
  const discountAmount = Math.round(stayPrice * discount.rate * 100) / 100;
  const totalAfterDiscount = Math.round((stayPrice - discountAmount) * 100) / 100;
  const amountCents = Math.round(totalAfterDiscount * 100);

  if (!Number.isInteger(amountCents) || amountCents <= 0) {
    throw new Error('Calculated booking amount is invalid.');
  }

  return {
    valid: true,
    listingId: apartmentKey,
    currency: 'GBP',
    nights,
    rateTotal: stayPrice,
    airbnbTotal: 0,
    subtotal: stayPrice,
    cleaningFee: 0,
    extraGuestFeeTotal,
    discountRate: discount.rate,
    discountAmount,
    totalAfterDiscount,
    guestSavings: 0,
    guestSavingsPercentage: 0,
    nightlyRates: Array.from({ length: nights }, () => Math.round((stayPrice / nights) * 100) / 100),
    airbnbRates: [],
    bookingType: input.bookingType,
    savingsLabel: discount.label,
    fallbackUsed: false,
    amountCents,
  };
}

export async function getAuthoritativePricing(
  input: BookingInputs,
  customerId: number,
  apartmentId: number,
  availabilityChecker = checkSmoobuAvailability,
): Promise<AuthoritativePricing> {
  const response = await availabilityChecker({
    arrivalDate: input.checkIn,
    departureDate: input.checkOut,
    apartments: [apartmentId],
    customerId,
    guests: input.guests,
  });

  return calculatePricingFromAvailability(input, response, apartmentId);
}
