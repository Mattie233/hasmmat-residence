import { NextResponse } from 'next/server';
import type { GuestBookingDetails } from '@/lib/bookingRequest';
import { getAuthoritativePricing, validateBookingInputs } from '@/lib/bookingPricing';
import { siteInfo } from '@/lib/data';
import { getSmoobuEnv } from '@/lib/env';

export const dynamic = 'force-dynamic';

type CheckoutRequest = {
  checkIn?: unknown;
  checkOut?: unknown;
  guests?: unknown;
  bookingType?: unknown;
} & Partial<GuestBookingDetails>;

function getBaseUrl(request: Request) {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (configuredUrl) return configuredUrl.replace(/\/$/, '');

  const origin = request.headers.get('origin');
  if (origin) return origin;

  return 'http://localhost:3000';
}

function metadataText(value: string | undefined, fallback: string) {
  return (value?.trim() || fallback).slice(0, 500);
}

export async function POST(request: Request) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const { SMOOBU_CUSTOMER_ID, SMOOBU_APARTMENT_ID } = getSmoobuEnv();
    const body = (await request.json()) as CheckoutRequest;

    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: 'Stripe is not configured yet. Please add STRIPE_SECRET_KEY in Vercel.' },
        { status: 503 },
      );
    }

    let input;
    try {
      input = validateBookingInputs(body);
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Invalid checkout details.' },
        { status: 400 },
      );
    }

    const guestName = typeof body.guestName === 'string' ? body.guestName.trim() : '';
    const guestEmail = typeof body.guestEmail === 'string' ? body.guestEmail.trim() : '';
    const guestPhone = typeof body.guestPhone === 'string' ? body.guestPhone.trim() : '';
    const guestAddress = typeof body.guestAddress === 'string' ? body.guestAddress.trim() : '';
    const specialRequests = typeof body.specialRequests === 'string' ? body.specialRequests.trim() : '';

    if (!guestName || !guestEmail.includes('@') || !guestPhone) {
      return NextResponse.json({ error: 'Missing required guest details.' }, { status: 400 });
    }

    const pricing = await getAuthoritativePricing(input, SMOOBU_CUSTOMER_ID, SMOOBU_APARTMENT_ID);
    const amount = pricing.amountCents;

    const baseUrl = getBaseUrl(request);
    const params = new URLSearchParams();

    params.set('mode', 'payment');
    params.set('billing_address_collection', 'required');
    params.set('phone_number_collection[enabled]', 'true');
    params.set('payment_method_options[card][request_three_d_secure]', 'automatic');
    params.set('success_url', `${baseUrl}/?payment=success#booking`);
    params.set('cancel_url', `${baseUrl}/?payment=cancelled#booking`);
    params.set('line_items[0][quantity]', '1');
    params.set('line_items[0][price_data][currency]', 'gbp');
    params.set('line_items[0][price_data][unit_amount]', `${amount}`);
    params.set('line_items[0][price_data][product_data][name]', `${siteInfo.name} direct booking`);
    params.set(
      'line_items[0][price_data][product_data][description]',
      `${input.checkIn} to ${input.checkOut}, ${input.guests} guest${input.guests === 1 ? '' : 's'}, ${pricing.nights} night${pricing.nights === 1 ? '' : 's'}`,
    );
    params.set('payment_intent_data[description]', `${siteInfo.name}: ${input.checkIn} to ${input.checkOut}`);
    params.set('metadata[checkIn]', input.checkIn);
    params.set('metadata[checkOut]', input.checkOut);
    params.set('metadata[guests]', `${input.guests}`);
    params.set('metadata[nights]', `${pricing.nights}`);
    params.set('metadata[bookingType]', input.bookingType);
    params.set('metadata[amountCents]', `${pricing.amountCents}`);
    params.set('metadata[currency]', pricing.currency);
    params.set('metadata[quotedTotal]', `£${pricing.totalAfterDiscount.toFixed(2)}`);
    params.set('metadata[rate]', pricing.savingsLabel);
    params.set('metadata[guestName]', metadataText(guestName, 'Not provided'));
    params.set('metadata[guestEmail]', metadataText(guestEmail, 'Not provided'));
    params.set('metadata[guestPhone]', metadataText(guestPhone, 'Not provided'));
    params.set('metadata[guestAddress]', metadataText(guestAddress, 'Not provided'));
    params.set('metadata[specialRequests]', metadataText(specialRequests, 'None'));
    params.set('metadata[apartmentId]', `${SMOOBU_APARTMENT_ID}`);

    params.set('customer_email', guestEmail.trim());

    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    const data = (await response.json()) as { url?: string; error?: { message?: string } };

    if (!response.ok || !data.url) {
      return NextResponse.json(
        { error: data.error?.message || 'Unable to create Stripe checkout session.' },
        { status: response.status || 500 },
      );
    }

    return NextResponse.json({ url: data.url });
  } catch (error) {
    console.error('Checkout API error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Unable to start checkout at this time.' }, { status: 500 });
  }
}
