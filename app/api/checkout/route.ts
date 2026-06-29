import { NextResponse } from 'next/server';
import type { BookingRequestDetail, GuestBookingDetails } from '@/lib/bookingRequest';
import { siteInfo } from '@/lib/data';

export const dynamic = 'force-dynamic';

type CheckoutRequest = BookingRequestDetail & GuestBookingDetails;

function formatBookingType(value: string) {
  return value === 'nonrefundable' ? 'Non-refundable' : 'Refundable';
}

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
    const body = (await request.json()) as CheckoutRequest;
    const {
      checkIn,
      checkOut,
      guests,
      nights,
      bookingType,
      total,
      savingsLabel,
      guestName,
      guestEmail,
      guestPhone,
      guestAddress,
      specialRequests,
    } = body;

    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: 'Stripe is not configured yet. Please add STRIPE_SECRET_KEY in Vercel.' },
        { status: 503 },
      );
    }

    if (!checkIn || !checkOut || !guests || !nights || !bookingType || !total || total <= 0) {
      return NextResponse.json({ error: 'Missing required checkout details.' }, { status: 400 });
    }

    if (!guestName?.trim() || !guestEmail?.includes('@') || !guestPhone?.trim()) {
      return NextResponse.json({ error: 'Missing required guest details.' }, { status: 400 });
    }

    const baseUrl = getBaseUrl(request);
    const amount = Math.round(total * 100);
    const params = new URLSearchParams();

    params.set('mode', 'payment');
    params.set('success_url', `${baseUrl}/?payment=success#booking`);
    params.set('cancel_url', `${baseUrl}/?payment=cancelled#booking`);
    params.set('line_items[0][quantity]', '1');
    params.set('line_items[0][price_data][currency]', 'gbp');
    params.set('line_items[0][price_data][unit_amount]', `${amount}`);
    params.set('line_items[0][price_data][product_data][name]', `${siteInfo.name} direct booking`);
    params.set(
      'line_items[0][price_data][product_data][description]',
      `${checkIn} to ${checkOut}, ${guests} guest${guests === 1 ? '' : 's'}, ${nights} night${nights === 1 ? '' : 's'}`,
    );
    params.set('payment_intent_data[description]', `${siteInfo.name}: ${checkIn} to ${checkOut}`);
    params.set('metadata[checkIn]', checkIn);
    params.set('metadata[checkOut]', checkOut);
    params.set('metadata[guests]', `${guests}`);
    params.set('metadata[nights]', `${nights}`);
    params.set('metadata[bookingType]', formatBookingType(bookingType));
    params.set('metadata[quotedTotal]', `£${total.toFixed(0)}`);
    params.set('metadata[rate]', savingsLabel);
    params.set('metadata[guestName]', metadataText(guestName, 'Not provided'));
    params.set('metadata[guestEmail]', metadataText(guestEmail, 'Not provided'));
    params.set('metadata[guestPhone]', metadataText(guestPhone, 'Not provided'));
    params.set('metadata[guestAddress]', metadataText(guestAddress, 'Not provided'));
    params.set('metadata[specialRequests]', metadataText(specialRequests, 'None'));

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
