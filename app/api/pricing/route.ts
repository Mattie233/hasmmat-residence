import { NextResponse } from 'next/server';
import { getSmoobuEnv } from '@/lib/env';
import { checkSmoobuAvailability } from '@/lib/smoobu';
import { BookingType, PricingRequest } from '@/types';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

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

    const totalPrice = Math.round(Number(smoobuPrice.price) * 100) / 100;
    const nightlyAverage = Math.round((totalPrice / nights) * 100) / 100;

    return NextResponse.json(
      {
        valid: true,
        listingId: apartmentKey,
        currency: smoobuPrice.currency || 'GBP',
        nights,
        rateTotal: totalPrice,
        airbnbTotal: 0,
        subtotal: totalPrice,
        cleaningFee: 0,
        extraGuestFeeTotal: 0,
        discountRate: 0,
        discountAmount: 0,
        totalAfterDiscount: totalPrice,
        guestSavings: 0,
        guestSavingsPercentage: 0,
        nightlyRates: Array.from({ length: nights }, () => nightlyAverage),
        airbnbRates: [],
        bookingType: bookingType as BookingType,
        savingsLabel: 'Available in Smoobu',
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
