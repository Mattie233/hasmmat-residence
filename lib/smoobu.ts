import { SmoobuAvailabilityRequest, SmoobuAvailabilityResponse } from '@/types';

const SMOOBU_AVAILABILITY_URL = 'https://login.smoobu.com/booking/checkApartmentAvailability';

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
