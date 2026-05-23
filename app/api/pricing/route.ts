import { NextResponse } from 'next/server';
import { getSmoobuEnv } from '@/lib/env';
import { checkSmoobuAvailability } from '@/lib/smoobu';
import { BookingType, PricingRequest } from '@/types';

export const dynamic = 'force-dynamic';

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const INCLUDED_GUESTS = 4;
const EXTRA_GUEST_FEE = 15;
const DIRECT_BOOKING_DISCOUNT_RATE = 0.1;
const LAST_MINUTE_DISCOUNT_RATE = 0.12;
const NON_REFUNDABLE_DISCOUNT_RATE = 0.18;
const LONG_STAY_DISCOUNT_RATE = 0.2;
const LONG_STAY_MIN_NIGHTS = 28;
const LAST_MINUTE_DAYS = 7;

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

export async function POST(request: Request) {
  try {
    const { SMOOBU_API_KEY, SMOOBU_CUSTOMER_ID, SMOOBU_APARTMENT_ID } = getSmoobuEnv();
    const body = (await request.json()) as PricingRequest;
    const { checkIn, checkOut, guests, bookingType, listingId } = body;
    const apartmentId = Number(listingId || SMOOBU_APARTMENT_ID);

    if (!checkIn || !checkOut || !guests || !bookingType) {
      return NextResponse.json({ error: 'Missing required booking fields.' }, { status: 400 });
    }

    if (!Number.isInteger(apartmentId)) {
      return NextResponse.json({ error: 'Invalid Smoobu apartment ID.' }, { status: 400 });
    }

    const nights = Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / MS_PER_DAY);
    if (nights <= 0) {
      return NextResponse.json({ error: 'Check-out must be after check-in.' }, { status: 400 });
    }

    const response = await checkSmoobuAvailability(SMOOBU_API_KEY, {
      arrivalDate: checkIn,
      departureDate: checkOut,
      apartments: [apartmentId],
      customerId: SMOOBU_CUSTOMER_ID,
      guests,
    });

    const apartmentKey = `${apartmentId}`;
    const available = response.availableApartments?.includes(apartmentId) ?? false;
    const smoobuPrice = response.prices?.[apartmentKey];
    const unavailableReason = response.errorMessages?.[apartmentKey]?.message;

    if (!available || !smoobuPrice) {
      return NextResponse.json(
        {
          error: unavailableReason || 'This stay is not available for the selected dates.',
          valid: false,
          listingId: apartmentKey,
          currency: smoobuPrice?.currency || 'GBP',
          nights,
          fallbackUsed: false,
        },
        { status: 409 },
      );
    }

    const stayPrice = Math.round(Number(smoobuPrice.price) * 100) / 100;
    const extraGuestFeeTotal = Math.max(0, guests - INCLUDED_GUESTS) * EXTRA_GUEST_FEE * nights;
    const subtotal = stayPrice + extraGuestFeeTotal;
    const discount = getDiscount(checkIn, nights, bookingType as BookingType);
    const discountAmount = Math.round(subtotal * discount.rate * 100) / 100;
    const totalAfterDiscount = Math.round((subtotal - discountAmount) * 100) / 100;
    const nightlyAverage = Math.round((stayPrice / nights) * 100) / 100;

    return NextResponse.json(
      {
        valid: true,
        listingId: apartmentKey,
        currency: smoobuPrice.currency || 'GBP',
        nights,
        rateTotal: stayPrice,
        airbnbTotal: 0,
        subtotal,
        cleaningFee: 0,
        extraGuestFeeTotal,
        discountRate: discount.rate,
        discountAmount,
        totalAfterDiscount,
        guestSavings: 0,
        guestSavingsPercentage: 0,
        nightlyRates: Array.from({ length: nights }, () => nightlyAverage),
        airbnbRates: [],
        bookingType: bookingType as BookingType,
        savingsLabel: discount.label,
        fallbackUsed: false,
      },
      {
        headers: {
          'Cache-Control': 'private, no-store',
        },
      },
    );
  } catch (error) {
    console.error('Pricing API error:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      {
        error: 'Unable to calculate pricing at this time.',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
