import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { POST as disabledBookingPost } from '@/app/api/booking/route';
import { PaymentSuccessPanel } from '@/components/PaymentSuccessPanel';
import { sendPaidBookingEmails, type PaidBookingDetails } from '@/lib/bookingEmails';
import { getCanonicalSiteUrl, getStripeReturnUrls, PRODUCTION_SITE_URL } from '@/lib/siteUrl';
import { getCheckoutReturnState, type CheckoutReturnState } from '@/lib/stripeCheckoutReturn';

const validMetadata = {
  checkIn: '2030-01-01',
  checkOut: '2030-01-03',
  guests: '2',
  nights: '2',
  bookingType: 'flexible',
  amountCents: '41364',
  currency: 'GBP',
  apartmentId: '3264062',
  rate: 'Direct website rate',
};

function stripeSession(overrides: Record<string, unknown> = {}) {
  return {
    id: 'cs_test_verified123',
    object: 'checkout.session',
    mode: 'payment',
    status: 'complete',
    payment_status: 'paid',
    amount_total: 41364,
    currency: 'gbp',
    metadata: validMetadata,
    ...overrides,
  };
}

function stripeFetch(session: Record<string, unknown>, status = 200): typeof fetch {
  return (async () =>
    new Response(JSON.stringify(session), {
      status,
      headers: { 'Content-Type': 'application/json' },
    })) as typeof fetch;
}

test('legacy booking endpoint is disabled and cannot trigger email delivery', async () => {
  const originalFetch = globalThis.fetch;
  let fetchCalled = false;
  globalThis.fetch = (async () => {
    fetchCalled = true;
    throw new Error('Unexpected external request');
  }) as typeof fetch;

  try {
    const response = await disabledBookingPost();
    assert.equal(response.status, 410);
    assert.match((await response.json()).error, /legacy booking endpoint is no longer available/i);
    assert.equal(fetchCalled, false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('canonical site URL cannot fall back to a caller-controlled origin', () => {
  assert.equal(
    getCanonicalSiteUrl({ NODE_ENV: 'production', NEXT_PUBLIC_SITE_URL: PRODUCTION_SITE_URL }),
    PRODUCTION_SITE_URL,
  );
  assert.throws(
    () => getCanonicalSiteUrl({ NODE_ENV: 'production', NEXT_PUBLIC_SITE_URL: undefined }),
    /Missing NEXT_PUBLIC_SITE_URL/,
  );
  assert.throws(
    () => getCanonicalSiteUrl({ NODE_ENV: 'production', NEXT_PUBLIC_SITE_URL: 'https://www.hasmmat-residence.com' }),
    /must be https:\/\/hasmmatresidence\.com/,
  );

  assert.deepEqual(getStripeReturnUrls(PRODUCTION_SITE_URL), {
    successUrl: 'https://hasmmatresidence.com/booking-success?session_id={CHECKOUT_SESSION_ID}',
    cancelUrl: 'https://hasmmatresidence.com/enquire?payment=cancelled#booking',
  });
});

test('verified paid Checkout Session produces a paid return state', async () => {
  let lookedUpSessionId = '';
  const state = await getCheckoutReturnState('cs_test_verified123', {
    stripeSecretKey: 'sk_test_mock',
    configuredApartmentId: 3264062,
    fetchImpl: stripeFetch(stripeSession()),
    confirmationLookup: async (sessionId) => {
      lookedUpSessionId = sessionId;
      return true;
    },
  });

  assert.deepEqual(state, {
    status: 'paid',
    confirmationEmail: 'sent',
    details: {
      checkIn: '2030-01-01',
      checkOut: '2030-01-03',
      guests: 2,
      bookingType: 'Refundable',
      amountPaidCents: 41364,
    },
  });
  assert.equal(lookedUpSessionId, 'cs_test_verified123');
});

test('unpaid, invalid, missing and unavailable Checkout Sessions never produce success', async () => {
  const pending = await getCheckoutReturnState('cs_test_verified123', {
    stripeSecretKey: 'sk_test_mock',
    configuredApartmentId: 3264062,
    fetchImpl: stripeFetch(stripeSession({ status: 'open', payment_status: 'unpaid' })),
  });
  assert.equal(pending.status, 'pending');

  const invalid = await getCheckoutReturnState('cs_test_verified123', {
    stripeSecretKey: 'sk_test_mock',
    configuredApartmentId: 3264062,
    fetchImpl: stripeFetch(stripeSession({ amount_total: 100 })),
  });
  assert.deepEqual(invalid, { status: 'invalid' });

  assert.deepEqual(
    await getCheckoutReturnState(undefined, {
      stripeSecretKey: 'sk_test_mock',
      configuredApartmentId: 3264062,
    }),
    { status: 'missing' },
  );

  assert.deepEqual(
    await getCheckoutReturnState('cs_test_verified123', {
      stripeSecretKey: undefined,
      configuredApartmentId: 3264062,
    }),
    { status: 'unavailable' },
  );
});

test('success panel renders paid, processing and unverified states safely', () => {
  const details = {
    checkIn: '2030-01-01',
    checkOut: '2030-01-03',
    guests: 2,
    bookingType: 'Refundable' as const,
    amountPaidCents: 41364,
  };
  const paidState: CheckoutReturnState = { status: 'paid', details, confirmationEmail: 'sent' };
  const paidHtml = renderToStaticMarkup(createElement(PaymentSuccessPanel, { state: paidState }));
  assert.match(paidHtml, /Payment received/);
  assert.match(paidHtml, /Your booking has been received/);
  assert.match(paidHtml, /confirmation email has been sent/);
  assert.match(paidHtml, /1 January 2030/);
  assert.match(paidHtml, /3 January 2030/);
  assert.match(paidHtml, /£413\.64/);
  assert.doesNotMatch(paidHtml, /cs_test_/);

  const processingHtml = renderToStaticMarkup(
    createElement(PaymentSuccessPanel, {
      state: { status: 'paid', details, confirmationEmail: 'processing' },
    }),
  );
  assert.match(processingHtml, /confirmation email will be sent once processing completes/);

  const invalidHtml = renderToStaticMarkup(
    createElement(PaymentSuccessPanel, { state: { status: 'invalid' } }),
  );
  assert.match(invalidHtml, /Payment not verified/);
  assert.doesNotMatch(invalidHtml, /Payment received/);
});

test('paid guest email contains stay terms and never exposes the Stripe payment identifier', async () => {
  const originalFetch = globalThis.fetch;
  const originalApiKey = process.env.RESEND_API_KEY;
  const originalFrom = process.env.BOOKING_EMAIL_FROM;
  const originalOwner = process.env.BOOKING_NOTIFICATION_EMAIL;
  const sent: Array<Record<string, unknown>> = [];

  process.env.RESEND_API_KEY = 're_test_mock';
  process.env.BOOKING_EMAIL_FROM = 'Hasmmat Residence <bookings@hasmmatresidence.com>';
  process.env.BOOKING_NOTIFICATION_EMAIL = 'owner@example.com';
  globalThis.fetch = (async (_input, init) => {
    sent.push(JSON.parse(String(init?.body)) as Record<string, unknown>);
    return new Response('{}', { status: 200 });
  }) as typeof fetch;

  const details: PaidBookingDetails = {
    checkIn: '2030-01-01',
    checkOut: '2030-01-03',
    guests: '2',
    nights: '2',
    bookingType: 'Non-refundable',
    quotedTotal: '£413.64',
    rate: 'Non-refundable direct rate',
    guestName: 'Test Guest',
    guestEmail: 'guest@example.com',
    guestPhone: '+44 7000 000000',
    guestAddress: 'Guest address',
    specialRequests: 'None',
    paymentId: 'pi_secret_should_not_reach_guest',
  };

  try {
    await sendPaidBookingEmails(details);
    await sendPaidBookingEmails({ ...details, bookingType: 'Refundable' });
  } finally {
    globalThis.fetch = originalFetch;
    if (originalApiKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = originalApiKey;
    if (originalFrom === undefined) delete process.env.BOOKING_EMAIL_FROM;
    else process.env.BOOKING_EMAIL_FROM = originalFrom;
    if (originalOwner === undefined) delete process.env.BOOKING_NOTIFICATION_EMAIL;
    else process.env.BOOKING_NOTIFICATION_EMAIL = originalOwner;
  }

  const guestEmail = sent.find((message) => message.to === 'guest@example.com');
  assert.ok(guestEmail);
  const guestContent = `${guestEmail.html}\n${guestEmail.text}`;
  assert.equal(guestEmail.subject, 'Payment received – Hasmmat Residence booking');
  assert.match(guestContent, /Test Guest/);
  assert.match(guestContent, /Check-in time/);
  assert.match(guestContent, /3:00 PM/);
  assert.match(guestContent, /Check-out time/);
  assert.match(guestContent, /10:00 AM/);
  assert.match(guestContent, /62 Cross Flatts Grove, Leeds, West Yorkshire, LS11/);
  assert.match(guestContent, /Non-refundable bookings/);
  assert.match(guestContent, /No refund after payment has been received/);
  assert.match(guestContent, /bookings@hasmmatresidence\.com/);
  assert.match(guestContent, /\+44 7983818344/);
  assert.match(guestContent, /paid direct booking, not an enquiry/i);
  assert.doesNotMatch(guestContent, /pi_secret_should_not_reach_guest/);

  const refundableGuestEmail = sent.filter((message) => message.to === 'guest@example.com')[1];
  assert.ok(refundableGuestEmail);
  const refundableContent = `${refundableGuestEmail.html}\n${refundableGuestEmail.text}`;
  assert.match(refundableContent, /Refundable bookings/);
  assert.match(refundableContent, /Full refund if cancelled 7\+ days before check-in/);
  assert.match(refundableContent, /50% refund if cancelled within 3-7 days before check-in/);
  assert.match(refundableContent, /No refund within 72 hours of check-in/);
});
