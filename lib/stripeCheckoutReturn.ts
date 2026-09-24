import { verifyAuthoritativePaymentMetadata } from '@/lib/bookingPricing';

type StripeCheckoutSession = {
  id?: string;
  object?: string;
  mode?: string;
  status?: string | null;
  payment_status?: string | null;
  amount_total?: number | null;
  currency?: string | null;
  metadata?: Record<string, string> | null;
};

export type CheckoutReturnDetails = {
  checkIn: string;
  checkOut: string;
  guests: number;
  bookingType: 'Refundable' | 'Non-refundable';
  amountPaidCents: number;
};

export type CheckoutReturnState =
  | {
      status: 'paid';
      details: CheckoutReturnDetails;
      confirmationEmail: 'sent' | 'processing';
    }
  | {
      status: 'pending';
      details: CheckoutReturnDetails;
    }
  | {
      status: 'missing' | 'invalid' | 'unavailable';
    };

type CheckoutReturnDependencies = {
  stripeSecretKey?: string;
  configuredApartmentId: number;
  fetchImpl?: typeof fetch;
  confirmationLookup?: (stripeSessionId: string) => Promise<boolean>;
};

const CHECKOUT_SESSION_ID_PATTERN = /^cs_(?:test|live)_[A-Za-z0-9]+$/;

function safeDetails(session: StripeCheckoutSession, configuredApartmentId: number): CheckoutReturnDetails | null {
  const metadata = session.metadata || {};
  const apartmentId = Number(metadata.apartmentId);

  if (
    session.object !== 'checkout.session' ||
    session.mode !== 'payment' ||
    !session.id ||
    !Number.isInteger(configuredApartmentId) ||
    configuredApartmentId <= 0
  ) {
    return null;
  }

  try {
    const verified = verifyAuthoritativePaymentMetadata({
      metadata,
      amountTotal: session.amount_total,
      currency: session.currency,
      apartmentId,
      configuredApartmentId,
    });

    return {
      checkIn: verified.input.checkIn,
      checkOut: verified.input.checkOut,
      guests: verified.input.guests,
      bookingType: verified.input.bookingType === 'nonrefundable' ? 'Non-refundable' : 'Refundable',
      amountPaidCents: verified.amountCents,
    };
  } catch {
    return null;
  }
}

export async function getCheckoutReturnState(
  sessionId: string | undefined,
  {
    stripeSecretKey,
    configuredApartmentId,
    fetchImpl = fetch,
    confirmationLookup = async () => false,
  }: CheckoutReturnDependencies,
): Promise<CheckoutReturnState> {
  if (!sessionId) return { status: 'missing' };
  if (!CHECKOUT_SESSION_ID_PATTERN.test(sessionId)) return { status: 'invalid' };
  if (!stripeSecretKey) return { status: 'unavailable' };

  let response: Response;
  try {
    response = await fetchImpl(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`, {
      headers: {
        Authorization: `Bearer ${stripeSecretKey}`,
      },
      cache: 'no-store',
    });
  } catch {
    return { status: 'unavailable' };
  }

  if (response.status === 404) return { status: 'invalid' };
  if (!response.ok) return { status: 'unavailable' };

  let session: StripeCheckoutSession;
  try {
    session = (await response.json()) as StripeCheckoutSession;
  } catch {
    return { status: 'unavailable' };
  }

  if (session.id !== sessionId) return { status: 'invalid' };

  const details = safeDetails(session, configuredApartmentId);
  if (!details) return { status: 'invalid' };

  if (session.status !== 'complete' || session.payment_status !== 'paid') {
    return { status: 'pending', details };
  }

  let confirmationSent = false;
  try {
    confirmationSent = await confirmationLookup(sessionId);
  } catch {
    // Payment remains verified even if the local delivery-status lookup is temporarily unavailable.
  }

  return {
    status: 'paid',
    details,
    confirmationEmail: confirmationSent ? 'sent' : 'processing',
  };
}
