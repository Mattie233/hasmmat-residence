import assert from 'node:assert/strict';
import test from 'node:test';
import {
  calculatePricingFromAvailability,
  getAuthoritativePricing,
  verifyAuthoritativePaymentMetadata,
  validateBookingInputs,
} from '@/lib/bookingPricing';

const availability = {
  availableApartments: [3264062],
  prices: {
    '3264062': {
      price: 1000,
      currency: 'GBP',
    },
  },
};

test('calculates the existing direct booking price from mocked Smoobu data', async () => {
  let request: unknown;
  const pricing = await getAuthoritativePricing(
    validateBookingInputs({
      checkIn: '2030-01-01',
      checkOut: '2030-01-03',
      guests: 6,
      bookingType: 'flexible',
    }),
    1705732,
    3264062,
    async (availabilityRequest) => {
      request = availabilityRequest;
      return availability;
    },
  );

  assert.deepEqual(request, {
    arrivalDate: '2030-01-01',
    departureDate: '2030-01-03',
    apartments: [3264062],
    customerId: 1705732,
    guests: 6,
  });
  assert.equal(pricing.nights, 2);
  assert.equal(pricing.rateTotal, 1040);
  assert.equal(pricing.discountRate, 0.05);
  assert.equal(pricing.totalAfterDiscount, 988);
  assert.equal(pricing.amountCents, 98800);
});

test('preserves non-refundable and long-stay discount precedence', () => {
  const nonRefundable = calculatePricingFromAvailability(
    validateBookingInputs({
      checkIn: '2030-01-01',
      checkOut: '2030-01-03',
      guests: 4,
      bookingType: 'nonrefundable',
    }),
    availability,
    3264062,
  );
  const longStay = calculatePricingFromAvailability(
    validateBookingInputs({
      checkIn: '2030-01-01',
      checkOut: '2030-01-29',
      guests: 4,
      bookingType: 'nonrefundable',
    }),
    {
      ...availability,
      prices: { '3264062': { price: 2800, currency: 'GBP' } },
    },
    3264062,
  );

  assert.equal(nonRefundable.discountRate, 0.1);
  assert.equal(nonRefundable.amountCents, 90000);
  assert.equal(longStay.discountRate, 0.12);
  assert.equal(longStay.amountCents, 246400);
});

test('ignores a manipulated browser total because the server calculates amountCents', () => {
  const browserInput = {
    checkIn: '2030-01-01',
    checkOut: '2030-01-03',
    guests: 6,
    bookingType: 'flexible' as const,
    total: 1,
  };
  const pricing = calculatePricingFromAvailability(validateBookingInputs(browserInput), availability, 3264062);

  assert.equal(pricing.amountCents, 98800);
  assert.notEqual(pricing.amountCents, browserInput.total * 100);
});

test('rejects invalid booking inputs and mismatched authoritative payment metadata', () => {
  assert.throws(() => validateBookingInputs({ checkIn: '2030-02-30', checkOut: '2030-03-02', guests: 2, bookingType: 'flexible' }));
  assert.throws(() => validateBookingInputs({ checkIn: '2030-01-01', checkOut: '2030-01-03', guests: 9, bookingType: 'flexible' }));
  assert.throws(() => validateBookingInputs({ checkIn: '2030-01-01', checkOut: '2030-01-03', guests: 2, bookingType: 'unknown' }));

  const metadata = {
    checkIn: '2030-01-01',
    checkOut: '2030-01-03',
    guests: '6',
    nights: '2',
    bookingType: 'flexible',
    amountCents: '98800',
    currency: 'GBP',
    apartmentId: '3264062',
    rate: 'Direct website rate',
  };

  assert.doesNotThrow(() =>
    verifyAuthoritativePaymentMetadata({
      metadata,
      amountTotal: 98800,
      currency: 'gbp',
      apartmentId: 3264062,
      configuredApartmentId: 3264062,
    }),
  );
  assert.throws(() =>
    verifyAuthoritativePaymentMetadata({
      metadata,
      amountTotal: 100,
      currency: 'gbp',
      apartmentId: 3264062,
      configuredApartmentId: 3264062,
    }),
  );
  assert.throws(() =>
    verifyAuthoritativePaymentMetadata({
      metadata: { ...metadata, amountCents: '' },
      amountTotal: 98800,
      currency: 'gbp',
      apartmentId: 3264062,
      configuredApartmentId: 3264062,
    }),
  );
});
