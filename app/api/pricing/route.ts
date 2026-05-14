import { NextResponse } from 'next/server';
import { getServerEnv } from '@/lib/env';
import { fetchPriceLabsRatesWithFallback } from '@/lib/pricelabs';
import { calculatePricingBreakdown, normalizePriceLabsResponse } from '@/lib/pricing';
import { getPropertyConfig } from '@/lib/propertyConfig';
import { BookingType, PricingRequest } from '@/types';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export async function POST(request: Request) {
  try {
    const { PRICELABS_LISTING_ID } = getServerEnv();
    const body = (await request.json()) as PricingRequest;
    const { checkIn, checkOut, guests, bookingType, listingId } = body;
    const resolvedListingId = listingId || PRICELABS_LISTING_ID;

    if (!checkIn || !checkOut || !guests || !bookingType) {
      return NextResponse.json({ error: 'Missing required booking fields.' }, { status: 400 });
    }

    const nights = Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / MS_PER_DAY);
    if (nights <= 0) {
      return NextResponse.json({ error: 'Check-out must be after check-in.' }, { status: 400 });
    }

    const propertyConfig = getPropertyConfig(resolvedListingId);
    const { response, fallbackUsed } = await fetchPriceLabsRatesWithFallback(resolvedListingId, checkIn, checkOut);
    const normalizedResponse = normalizePriceLabsResponse(response);

    if (!normalizedResponse.rates.length) {
      return NextResponse.json({ error: 'Unable to load pricing for selected dates.' }, { status: 502 });
    }

    const breakdown = calculatePricingBreakdown({
      rates: normalizedResponse.rates,
      guests,
      bookingType: bookingType as BookingType,
      config: propertyConfig,
      fallbackUsed,
    });

    return NextResponse.json(
      {
        ...breakdown,
        currency: normalizedResponse.currency,
        listingId: normalizedResponse.listingId,
        fallbackUsed,
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=0, s-maxage=900, stale-while-revalidate=300',
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
