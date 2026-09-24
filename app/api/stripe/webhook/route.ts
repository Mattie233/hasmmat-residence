import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import { verifyAuthoritativePaymentMetadata } from '@/lib/bookingPricing';
import { prisma } from '@/lib/db';
import { sendPaidBookingEmails, type PaidBookingDetails } from '@/lib/bookingEmails';
import { getSmoobuEnv } from '@/lib/env';
import { checkSmoobuAvailability, createSmoobuReservation } from '@/lib/smoobu';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type StripeCheckoutSession = {
  id: string;
  object: 'checkout.session';
  payment_status?: string;
  payment_intent?: string | null;
  amount_total?: number | null;
  currency?: string | null;
  metadata?: Record<string, string>;
};

type StripeWebhookEvent = {
  id: string;
  type: string;
  data: {
    object: StripeCheckoutSession;
  };
};

function getSignatureParts(signature: string) {
  return signature.split(',').reduce(
    (parts, item) => {
      const [key, value] = item.split('=');
      if (key === 't') parts.timestamp = value;
      if (key === 'v1') parts.signature = value;
      return parts;
    },
    { timestamp: '', signature: '' },
  );
}

function verifyStripeSignature(payload: string, signature: string, secret: string) {
  const { timestamp, signature: expectedSignature } = getSignatureParts(signature);
  if (!timestamp || !expectedSignature) return false;

  const signedPayload = `${timestamp}.${payload}`;
  const actualSignature = crypto.createHmac('sha256', secret).update(signedPayload).digest('hex');
  const expectedBuffer = Buffer.from(expectedSignature, 'hex');
  const actualBuffer = Buffer.from(actualSignature, 'hex');

  return expectedBuffer.length === actualBuffer.length && crypto.timingSafeEqual(expectedBuffer, actualBuffer);
}

function metadataValue(metadata: Record<string, string>, key: string, fallback = 'Not provided') {
  return metadata[key] || fallback;
}

function formatBookingType(value: 'flexible' | 'nonrefundable') {
  return value === 'nonrefundable' ? 'Non-refundable' : 'Refundable';
}

function parseGuestName(value: string) {
  const [firstName, ...lastNameParts] = value.trim().split(/\s+/);
  return {
    firstName: firstName || 'Guest',
    lastName: lastNameParts.join(' ') || 'Guest',
  };
}

function parseDate(value: string) {
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json({ error: 'Stripe webhook secret is not configured.' }, { status: 503 });
  }

  const payload = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature || !verifyStripeSignature(payload, signature, webhookSecret)) {
    return NextResponse.json({ error: 'Invalid Stripe signature.' }, { status: 400 });
  }

  const event = JSON.parse(payload) as StripeWebhookEvent;

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object;

  if (session.payment_status !== 'paid') {
    return NextResponse.json({ received: true });
  }

  const metadata = session.metadata || {};
  const { SMOOBU_APARTMENT_ID } = getSmoobuEnv();
  const guestEmail = metadataValue(metadata, 'guestEmail', '');
  const apartmentId = Number(metadata.apartmentId);
  let verifiedPayment;

  try {
    verifiedPayment = verifyAuthoritativePaymentMetadata({
      metadata,
      amountTotal: session.amount_total,
      currency: session.currency,
      apartmentId,
      configuredApartmentId: SMOOBU_APARTMENT_ID,
    });
  } catch {
    return NextResponse.json({ error: 'Invalid authoritative booking metadata.' }, { status: 400 });
  }

  if (!guestEmail.includes('@')) {
    console.error('Stripe booking amount or metadata verification failed', {
      endpoint: '/api/stripe/webhook',
      sessionId: session.id,
    });
    return NextResponse.json({ error: 'Missing guest email metadata.' }, { status: 400 });
  }

  const details: PaidBookingDetails = {
    checkIn: verifiedPayment.input.checkIn,
    checkOut: verifiedPayment.input.checkOut,
    guests: `${verifiedPayment.input.guests}`,
    nights: `${verifiedPayment.nights}`,
    bookingType: formatBookingType(verifiedPayment.input.bookingType),
    quotedTotal: `£${(verifiedPayment.amountCents / 100).toFixed(2)}`,
    rate: verifiedPayment.rate,
    guestName: metadataValue(metadata, 'guestName'),
    guestEmail,
    guestPhone: metadataValue(metadata, 'guestPhone'),
    guestAddress: metadataValue(metadata, 'guestAddress'),
    specialRequests: metadataValue(metadata, 'specialRequests', 'None'),
    paymentId: session.payment_intent || session.id,
  };

  const checkIn = parseDate(details.checkIn);
  const checkOut = parseDate(details.checkOut);
  const guests = Number(details.guests);
  const nightsFromMetadata = Number(details.nights);
  const totalPaid = session.amount_total || 0;

  if (
    !checkIn ||
    !checkOut ||
    !Number.isInteger(guests) ||
    guests <= 0 ||
    !Number.isInteger(nightsFromMetadata) ||
    nightsFromMetadata <= 0 ||
    !Number.isInteger(totalPaid) ||
    totalPaid <= 0 ||
    !Number.isInteger(apartmentId) ||
    apartmentId <= 0
  ) {
    console.error('Stripe booking sync validation failed', {
      endpoint: '/api/stripe/webhook',
      sessionId: session.id,
      hasValidDates: Boolean(checkIn && checkOut),
      guests,
      nights: nightsFromMetadata,
      totalPaid,
      apartmentId,
    });
    return NextResponse.json({ error: 'Invalid paid booking metadata.' }, { status: 400 });
  }

  let booking = await prisma.paidBooking.findUnique({
    where: { stripeSessionId: session.id },
  });
  let createdBooking = false;

  if (booking?.smoobuReservationId && booking.confirmationSentAt) {
    return NextResponse.json({ received: true });
  }

  if (!booking) {
    try {
      booking = await prisma.paidBooking.create({
        data: {
          stripeSessionId: session.id,
          stripePaymentIntentId: session.payment_intent || undefined,
          apartmentId,
          guestName: details.guestName,
          guestEmail: details.guestEmail,
          guestPhone: details.guestPhone,
          guestAddress: details.guestAddress,
          specialRequests: details.specialRequests,
          checkIn,
          checkOut,
          guests,
          totalPaid,
          bookingType: details.bookingType,
          nights: nightsFromMetadata,
          rate: details.rate,
        },
      });
      createdBooking = true;
    } catch (error) {
      const existingBooking = await prisma.paidBooking.findUnique({
        where: { stripeSessionId: session.id },
      });
      if (!existingBooking) throw error;
      booking = existingBooking;
    }
  }

  if (booking.smoobuReservationId && !booking.confirmationSentAt) {
    await sendPaidBookingEmails(details);
    await prisma.paidBooking.update({
      where: { id: booking.id },
      data: { confirmationSentAt: new Date() },
    });
    return NextResponse.json({ received: true });
  }

  if (!createdBooking && booking.syncStatus === 'PROCESSING') {
    return NextResponse.json({ received: true });
  }

  try {
    const { SMOOBU_CUSTOMER_ID } = getSmoobuEnv();
    const availability = await checkSmoobuAvailability({
      arrivalDate: details.checkIn,
      departureDate: details.checkOut,
      apartments: [apartmentId],
      customerId: SMOOBU_CUSTOMER_ID,
      guests,
    });

    if (!availability.availableApartments?.includes(apartmentId)) {
      throw new Error(availability.errorMessages?.[`${apartmentId}`]?.message || 'The selected stay is no longer available.');
    }

    const { firstName, lastName } = parseGuestName(details.guestName);
    const reservation = await createSmoobuReservation({
      arrivalDate: details.checkIn,
      departureDate: details.checkOut,
      apartmentId,
      channelId: 70,
      arrivalTime: '15:00',
      departureTime: '10:00',
      firstName,
      lastName,
      notice: `Direct website booking ${session.id}. ${details.specialRequests}`,
      adults: guests,
      children: 0,
      price: totalPaid / 100,
      priceStatus: 1,
      address: {
        street: details.guestAddress || 'Not provided',
        postalCode: '',
        location: 'Leeds',
      },
      country: 'GB',
      email: details.guestEmail,
      phone: details.guestPhone,
      language: 'en',
    });

    if (!reservation.id) {
      throw new Error('Smoobu did not return a reservation ID.');
    }

    await prisma.paidBooking.update({
      where: { id: booking.id },
      data: {
        smoobuReservationId: reservation.id,
        syncStatus: 'SYNCED',
        syncError: null,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown Smoobu synchronization error';
    await prisma.paidBooking.update({
      where: { id: booking.id },
      data: { syncStatus: 'FAILED', syncError: message.slice(0, 1000) },
    });
    console.error('Paid booking Smoobu sync failed', {
      endpoint: '/api/stripe/webhook',
      sessionId: session.id,
      error: message,
    });
    return NextResponse.json(
      { error: 'Payment received, but booking synchronization requires manual action.' },
      { status: 500 },
    );
  }

  await sendPaidBookingEmails(details);
  await prisma.paidBooking.update({
    where: { id: booking.id },
    data: { confirmationSentAt: new Date() },
  });

  return NextResponse.json({ received: true });
}
