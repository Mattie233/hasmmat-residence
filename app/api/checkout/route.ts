import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getServerEnv } from '@/lib/env';

export async function POST(request: Request) {
  const { STRIPE_SECRET_KEY } = getServerEnv();
  const stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15',
  });

  try {
    const body = await request.json();
    const { checkIn, checkOut, guests, bookingType, pricing } = body;

    if (
      !checkIn ||
      !checkOut ||
      !guests ||
      !bookingType ||
      !pricing ||
      typeof pricing.totalAfterDiscount !== 'number'
    ) {
      return NextResponse.json({ error: 'Missing booking details' }, { status: 400 });
    }

    const amount = Math.round(pricing.totalAfterDiscount * 100);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: 'Hasmmat Residence stay',
              description: `Booking from ${checkIn} to ${checkOut} for ${guests} guest(s) - ${bookingType}`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/?canceled=true`,
      metadata: {
        checkIn,
        checkOut,
        guests: `${guests}`,
        bookingType,
        rateTotal: `${pricing.rateTotal}`,
        discountAmount: `${pricing.discountAmount}`,
        stripeFeeEstimate: `${pricing.stripeFeeEstimate}`,
        hostPayoutEstimate: `${pricing.hostPayoutEstimate}`,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout API error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Unable to create checkout session' }, { status: 500 });
  }
}
