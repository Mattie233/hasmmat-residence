import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import { sendPaidBookingEmails, type PaidBookingDetails } from '@/lib/bookingEmails';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type StripeCheckoutSession = {
  id: string;
  object: 'checkout.session';
  payment_status?: string;
  payment_intent?: string | null;
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

  if (session.payment_status && session.payment_status !== 'paid') {
    return NextResponse.json({ received: true });
  }

  const metadata = session.metadata || {};
  const guestEmail = metadataValue(metadata, 'guestEmail', '');

  if (!guestEmail.includes('@')) {
    return NextResponse.json({ error: 'Missing guest email metadata.' }, { status: 400 });
  }

  const details: PaidBookingDetails = {
    checkIn: metadataValue(metadata, 'checkIn'),
    checkOut: metadataValue(metadata, 'checkOut'),
    guests: metadataValue(metadata, 'guests'),
    nights: metadataValue(metadata, 'nights'),
    bookingType: metadataValue(metadata, 'bookingType'),
    quotedTotal: metadataValue(metadata, 'quotedTotal'),
    rate: metadataValue(metadata, 'rate'),
    guestName: metadataValue(metadata, 'guestName'),
    guestEmail,
    guestPhone: metadataValue(metadata, 'guestPhone'),
    guestAddress: metadataValue(metadata, 'guestAddress'),
    specialRequests: metadataValue(metadata, 'specialRequests', 'None'),
    paymentId: session.payment_intent || session.id,
  };

  await sendPaidBookingEmails(details);

  return NextResponse.json({ received: true });
}
