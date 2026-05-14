import { PriceLabsApiResponse, PriceLabsRawRate } from '@/types';
import { buildFallbackRates } from '@/lib/pricing';
import { getPropertyConfig } from '@/lib/propertyConfig';

const PRICELABS_API_KEY = process.env.PRICELABS_API_KEY;
const PRICELABS_LISTING_ID = process.env.PRICELABS_LISTING_ID;
const PRICELABS_API_BASE_URL = process.env.PRICELABS_API_BASE_URL || 'https://api.pricelabs.co/v1';
const PRICE_LABS_CACHE_REVALIDATE = 900;

function validateEnv() {
  if (!PRICELABS_API_KEY) {
    throw new Error('Missing PRICELABS_API_KEY environment variable.');
  }

  if (!PRICELABS_LISTING_ID) {
    throw new Error('Missing PRICELABS_LISTING_ID environment variable.');
  }
}

function buildPriceLabsUrl(listingId: string, startDate: string, endDate: string) {
  return `${PRICELABS_API_BASE_URL}/rates?listing_id=${encodeURIComponent(listingId)}&start_date=${encodeURIComponent(
    startDate,
  )}&end_date=${encodeURIComponent(endDate)}`;
}

export async function fetchPriceLabsRates(
  listingId: string,
  startDate: string,
  endDate: string,
): Promise<PriceLabsApiResponse> {
  validateEnv();

  const url = buildPriceLabsUrl(listingId, startDate, endDate);
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${PRICELABS_API_KEY}`,
      'Content-Type': 'application/json',
    },
    cache: 'force-cache',
    next: {
      revalidate: PRICE_LABS_CACHE_REVALIDATE,
    },
  });

  if (!response.ok) {
    const payload = await response.text();
    throw new Error(`PriceLabs request failed with status ${response.status}: ${payload}`);
  }

  return response.json();
}

export async function fetchPriceLabsRatesWithFallback(
  listingId: string,
  checkIn: string,
  checkOut: string,
): Promise<{ response: PriceLabsApiResponse; fallbackUsed: boolean }> {
  const config = getPropertyConfig(listingId);
  const nights = Math.max(
    0,
    Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)),
  );

  try {
    const endDate = new Date(new Date(checkOut).getTime() - 86400000).toISOString().slice(0, 10);
    const response = await fetchPriceLabsRates(listingId, checkIn, endDate);

    if (!response?.rates?.length) {
      throw new Error('Empty PriceLabs rate response.');
    }

    return { response, fallbackUsed: false };
  } catch (error) {
    console.error('PriceLabs fetch error:', error instanceof Error ? error.message : error);

    const fallbackRates: PriceLabsRawRate[] = buildFallbackRates(checkIn, nights, config).map((rate) => ({
      date: rate.date,
      airbnb_rate: rate.airbnbRate,
      pricelabs_rate: rate.priceLabsRate,
      min_stay: rate.minStay,
      available: rate.available,
    }));

    return {
      response: {
        listing_id: listingId,
        currency: 'GBP',
        rates: fallbackRates,
      },
      fallbackUsed: true,
    };
  }
}
