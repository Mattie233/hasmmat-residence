import { createHash, createHmac, randomUUID } from 'node:crypto';
import { SmoobuAvailabilityRequest, SmoobuAvailabilityResponse, SmoobuRatesResponse } from '@/types';
import { getSmoobuEnv } from '@/lib/env';

type SmoobuRequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  query?: URLSearchParams;
  body?: unknown;
};

function canonicalQuery(query: URLSearchParams) {
  return [...query.entries()]
    .sort(([firstKey, firstValue], [secondKey, secondValue]) =>
      firstKey === secondKey ? firstValue.localeCompare(secondValue) : firstKey.localeCompare(secondKey),
    )
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
}

export async function smoobuRequest<T>(path: string, options: SmoobuRequestOptions = {}): Promise<T> {
  const { SMOOBU_API_KEY, SMOOBU_API_SECRET } = getSmoobuEnv();
  const method = options.method || 'GET';
  const query = options.query || new URLSearchParams();
  const body = options.body === undefined ? '' : JSON.stringify(options.body);
  const timestamp = new Date().toISOString();
  const nonce = randomUUID();
  const bodyHash = createHash('sha256').update(body, 'utf8').digest('hex');
  const canonicalString = [method, path, canonicalQuery(query), timestamp, nonce, bodyHash, SMOOBU_API_KEY].join('\n');
  const signature = createHmac('sha256', SMOOBU_API_SECRET).update(canonicalString, 'utf8').digest('base64');
  const url = new URL(path, 'https://login.smoobu.com');
  url.search = query.toString();

  const response = await fetch(url, {
    method,
    headers: {
      'X-API-Key': SMOOBU_API_KEY,
      'X-Timestamp': timestamp,
      'X-Nonce': nonce,
      'X-Signature': signature,
      'Cache-Control': 'no-cache',
      ...(options.body === undefined ? {} : { 'Content-Type': 'application/json' }),
    },
    ...(options.body === undefined ? {} : { body }),
    cache: 'no-store',
  });

  const responseText = await response.text();
  let data: T | { detail?: string; title?: string } = {};
  try {
    data = responseText ? (JSON.parse(responseText) as T) : {};
  } catch {
    data = { detail: responseText };
  }

  if (!response.ok) {
    const error = data as { detail?: string; title?: string };
    console.error('Smoobu request failed', {
      status: response.status,
      endpoint: path,
      error: error.detail || error.title || 'Unknown Smoobu error',
    });
    throw new Error(error.detail || error.title || `Smoobu request failed with status ${response.status}`);
  }

  return data as T;
}

export async function checkSmoobuAvailability(
  request: SmoobuAvailabilityRequest,
): Promise<SmoobuAvailabilityResponse> {
  return smoobuRequest<SmoobuAvailabilityResponse>('/booking/checkApartmentAvailability', {
    method: 'POST',
    body: request,
  });
}

export async function getSmoobuRates(
  apartmentId: number,
  startDate: string,
  endDate: string,
): Promise<SmoobuRatesResponse> {
  const query = new URLSearchParams();
  query.set('start_date', startDate);
  query.set('end_date', endDate);
  query.append('apartments[]', `${apartmentId}`);

  return smoobuRequest<SmoobuRatesResponse>('/api/rates', {
    method: 'GET',
    query,
  });
}

export type SmoobuApartmentsResponse = {
  apartments?: Array<{ id: number; name: string }>;
};

export type SmoobuReservationRequest = {
  arrivalDate: string;
  departureDate: string;
  apartmentId: number;
  channelId: number;
  arrivalTime: string;
  departureTime: string;
  firstName: string;
  lastName: string;
  notice: string;
  adults: number;
  children: number;
  price: number;
  priceStatus: number;
  address: {
    street: string;
    postalCode: string;
    location: string;
  };
  country: string;
  email: string;
  phone: string;
  language: string;
};

export type SmoobuReservationResponse = {
  id?: number;
  detail?: string;
  title?: string;
};

export function getSmoobuApartments() {
  return smoobuRequest<SmoobuApartmentsResponse>('/api/apartments');
}

export function createSmoobuReservation(request: SmoobuReservationRequest) {
  return smoobuRequest<SmoobuReservationResponse>('/api/reservations', {
    method: 'POST',
    body: request,
  });
}
