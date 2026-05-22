import { SmoobuAvailabilityRequest, SmoobuAvailabilityResponse, SmoobuRatesResponse } from '@/types';

const SMOOBU_AVAILABILITY_URL = 'https://login.smoobu.com/booking/checkApartmentAvailability';
const SMOOBU_RATES_URL = 'https://login.smoobu.com/api/rates';

export async function checkSmoobuAvailability(
  apiKey: string,
  request: SmoobuAvailabilityRequest,
): Promise<SmoobuAvailabilityResponse> {
  const response = await fetch(SMOOBU_AVAILABILITY_URL, {
    method: 'POST',
    headers: {
      'Api-Key': apiKey,
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
    cache: 'no-store',
  });

  const data = (await response.json()) as SmoobuAvailabilityResponse;

  if (!response.ok) {
    throw new Error(data.detail || data.title || `Smoobu request failed with status ${response.status}`);
  }

  return data;
}

export async function getSmoobuRates(
  apiKey: string,
  apartmentId: number,
  startDate: string,
  endDate: string,
): Promise<SmoobuRatesResponse> {
  const url = new URL(SMOOBU_RATES_URL);
  url.searchParams.set('start_date', startDate);
  url.searchParams.set('end_date', endDate);
  url.searchParams.append('apartments[]', `${apartmentId}`);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Api-Key': apiKey,
      'Cache-Control': 'no-cache',
    },
    cache: 'no-store',
  });

  const data = (await response.json()) as SmoobuRatesResponse;

  if (!response.ok) {
    throw new Error(data.detail || data.title || `Smoobu rates request failed with status ${response.status}`);
  }

  return data;
}
