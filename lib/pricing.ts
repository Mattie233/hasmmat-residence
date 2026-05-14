import {
  BookingType,
  NormalizedNightlyRate,
  PriceLabsApiResponse,
  PriceLabsRawRate,
  PricingBreakdown,
  PropertyPricingConfig,
} from '@/types';

export const DEFAULT_STRIPE_FEE_RATE = 0.02;

export function normalizePriceLabsRate(rate: PriceLabsRawRate): NormalizedNightlyRate {
  const airbnbRate = Number(rate.airbnb_rate ?? rate.rate ?? 0);
  const priceLabsRate = Number(rate.pricelabs_rate ?? rate.rate ?? rate.airbnb_rate ?? 0);

  return {
    date: rate.date,
    airbnbRate: Number.isFinite(airbnbRate) ? airbnbRate : 0,
    priceLabsRate: Number.isFinite(priceLabsRate) ? priceLabsRate : 0,
    minStay: rate.min_stay == null ? null : Number(rate.min_stay),
    available: rate.available !== false,
  };
}

export function normalizePriceLabsResponse(response: PriceLabsApiResponse) {
  const normalizedRates = Array.isArray(response.rates)
    ? response.rates.map(normalizePriceLabsRate)
    : [];

  const filteredRates = normalizedRates.filter((rate) => rate.date && typeof rate.priceLabsRate === 'number');

  return {
    listingId: response.listing_id,
    currency: response.currency || 'GBP',
    rates: filteredRates,
  };
}

export function getDirectBookingDiscountRate(nights: number, bookingType: BookingType) {
  if (nights <= 0) {
    return 0;
  }

  if (nights <= 13) {
    return bookingType === 'nonrefundable' ? 0.15 : 0.1;
  }

  return bookingType === 'nonrefundable' ? 0.12 : 0.08;
}

export function calculateExtraGuestFee(guests: number, config: PropertyPricingConfig) {
  const extraGuests = Math.max(0, guests - config.includedGuests);
  return extraGuests * config.extraGuestFee;
}

export function calculateStripeFee(amount: number, rate = DEFAULT_STRIPE_FEE_RATE) {
  return Math.round(amount * rate * 100) / 100;
}

export function buildFallbackRates(
  checkIn: string,
  nights: number,
  config: PropertyPricingConfig,
): NormalizedNightlyRate[] {
  const fallbackRates: NormalizedNightlyRate[] = [];
  const checkInDate = new Date(checkIn);

  for (let index = 0; index < nights; index += 1) {
    const date = new Date(checkInDate);
    date.setDate(date.getDate() + index);

    fallbackRates.push({
      date: date.toISOString().slice(0, 10),
      airbnbRate: config.fallbackNightlyRate,
      priceLabsRate: config.fallbackNightlyRate,
      minStay: 1,
      available: true,
    });
  }

  return fallbackRates;
}

export function calculatePricingBreakdown(params: {
  rates: NormalizedNightlyRate[];
  guests: number;
  bookingType: BookingType;
  config: PropertyPricingConfig;
  fallbackUsed?: boolean;
}): PricingBreakdown {
  const { config, rates, guests, bookingType, fallbackUsed = false } = params;
  const nights = rates.length;
  const rateTotal = rates.reduce((sum, nightly) => sum + nightly.priceLabsRate, 0);
  const airbnbTotal = rates.reduce((sum, nightly) => sum + nightly.airbnbRate, 0);
  const extraGuestFeeTotal = calculateExtraGuestFee(guests, config) * nights;
  const subtotal = rateTotal + config.cleaningFee + extraGuestFeeTotal;
  const discountRate = getDirectBookingDiscountRate(nights, bookingType);
  const discountAmount = Math.round(subtotal * discountRate);
  const totalAfterDiscount = subtotal - discountAmount;
  const stripeFeeEstimate = calculateStripeFee(totalAfterDiscount, config.stripeFeeRate);
  const hostPayoutEstimate = Math.round((totalAfterDiscount - stripeFeeEstimate) * 100) / 100;
  const guestSavings = Math.round(airbnbTotal - totalAfterDiscount);
  const guestSavingsPercentage = airbnbTotal > 0 ? Math.round((guestSavings / airbnbTotal) * 100) : 0;

  return {
    valid: nights > 0 && rates.every((rate) => rate.available),
    listingId: config.listingId,
    currency: 'GBP',
    nights,
    rateTotal,
    airbnbTotal,
    subtotal,
    cleaningFee: config.cleaningFee,
    extraGuestFeeTotal,
    discountRate,
    discountAmount,
    totalAfterDiscount,
    stripeFeeEstimate,
    hostPayoutEstimate,
    guestSavings,
    guestSavingsPercentage,
    nightlyRates: rates.map((rate) => rate.priceLabsRate),
    airbnbRates: rates.map((rate) => rate.airbnbRate),
    bookingType,
    savingsLabel:
      guestSavings > 0
        ? `Book direct and save £${guestSavings} vs Airbnb`
        : 'Competitive direct booking price',
    fallbackUsed,
  };
}
