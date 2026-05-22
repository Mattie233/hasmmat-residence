import { NextResponse } from 'next/server';
import { getSmoobuEnv } from '@/lib/env';
import { getSmoobuRates } from '@/lib/smoobu';
import { CalendarAvailabilityResponse } from '@/types';

export const dynamic = 'force-dynamic';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function parseDate(value: string | null) {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function eachDate(startDate: Date, endDate: Date) {
  const days: Date[] = [];
  const cursor = new Date(startDate);

  while (cursor.getTime() <= endDate.getTime()) {
    days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return days;
}

export async function GET(request: Request) {
  try {
    const { SMOOBU_API_KEY, SMOOBU_APARTMENT_ID } = getSmoobuEnv();
    const { searchParams } = new URL(request.url);
    const startDate = parseDate(searchParams.get('startDate'));
    const endDate = parseDate(searchParams.get('endDate'));
    const apartmentId = Number(searchParams.get('listingId') || SMOOBU_APARTMENT_ID);

    if (!startDate || !endDate) {
      return NextResponse.json({ error: 'Missing startDate or endDate.' }, { status: 400 });
    }

    if (!Number.isInteger(apartmentId)) {
      return NextResponse.json({ error: 'Invalid Smoobu apartment ID.' }, { status: 400 });
    }

    const dateSpan = Math.round((endDate.getTime() - startDate.getTime()) / MS_PER_DAY);
    if (dateSpan < 0 || dateSpan > 62) {
      return NextResponse.json({ error: 'Availability range must be between 1 and 63 days.' }, { status: 400 });
    }

    const rates = await getSmoobuRates(SMOOBU_API_KEY, apartmentId, toDateKey(startDate), toDateKey(endDate));
    const apartmentRates = rates.data?.[`${apartmentId}`] || {};

    const body: CalendarAvailabilityResponse = {
      days: Object.fromEntries(
        eachDate(startDate, endDate).map((date) => {
          const dateKey = toDateKey(date);
          const rate = apartmentRates[dateKey];

          return [
            dateKey,
            {
              available: Number(rate?.available || 0) > 0,
              price: typeof rate?.price === 'number' ? rate.price : null,
              minLengthOfStay: typeof rate?.min_length_of_stay === 'number' ? rate.min_length_of_stay : null,
            },
          ];
        }),
      ),
    };

    return NextResponse.json(body, {
      headers: {
        'Cache-Control': 'private, no-store',
      },
    });
  } catch (error) {
    console.error('Availability API error:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      {
        error: 'Unable to load Smoobu availability.',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
