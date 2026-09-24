import { NextResponse } from 'next/server';
import { getSmoobuEnv } from '@/lib/env';
import { getAuthoritativePricing, validateBookingInputs } from '@/lib/bookingPricing';
import type { PricingRequest } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { SMOOBU_CUSTOMER_ID, SMOOBU_APARTMENT_ID } = getSmoobuEnv();
    const body = (await request.json()) as PricingRequest;
    const input = validateBookingInputs(body);
    const pricing = await getAuthoritativePricing(input, SMOOBU_CUSTOMER_ID, SMOOBU_APARTMENT_ID);

    return NextResponse.json(
      pricing,
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
